import { BaseScraper } from './base.scraper'
import { ScraperResult } from '../types'
import * as cheerio from 'cheerio'
import redis from '../redis'
import { enqueueExtractEvent } from '../queues/ai.queue'

const RSS_FEEDS = [
  'https://feeds.businessdailyafrica.com/feed/',
  'https://feeds.nation.co.ke/feeds/rss/20180328/39146/',
]

/** Strip CDATA wrappers and trim (RSS titles/links often wrap CDATA). */
function rssPlainText(raw: string): string {
  return raw.replace(/^<!\[CDATA\[|\]\]>$/g, '').trim()
}

function rssItemTitle($: cheerio.CheerioAPI, item: cheerio.AnyNode): string {
  return rssPlainText($(item).find('title').first().text())
}

function rssItemLink($: cheerio.CheerioAPI, item: cheerio.AnyNode): string {
  const linkEl = $(item).find('link').first()
  const href = linkEl.attr('href')
  if (href) return rssPlainText(href)
  const text = rssPlainText(linkEl.text())
  if (text) return text
  const guid = $(item).find('guid').first()
  const guidHref = guid.attr('href')
  if (guidHref) return rssPlainText(guidHref)
  return rssPlainText(guid.text())
}

export class NewsScraper extends BaseScraper {
  readonly name = 'news'

  async run(): Promise<ScraperResult> {
    const errors: string[] = []
    let itemsFound = 0
    let itemsNew = 0

    for (const feed of RSS_FEEDS) {
      try {
        const response = await fetch(feed, { signal: AbortSignal.timeout(10000) })
        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`)

        const xml = await response.text()
        const $ = cheerio.load(xml)

        // Parse RSS items
        const items = $('item').slice(0, 10).toArray() // Latest 10

        for (const item of items) {
          try {
            const title = rssItemTitle($, item)
            const link = rssItemLink($, item)
            const pubDate = rssPlainText($(item).find('pubDate').first().text())

            if (!title || !link) continue

            // Check if URL already cached (7-day TTL)
            const cacheKey = `news-url:${link}`
            if (redis) {
              const cached = await redis.get(cacheKey)
              if (cached) {
                this.logInfo(`URL already processed: ${link}`)
                continue
              }
            }

            // Fetch full article
            try {
              const articleResponse = await fetch(link, { signal: AbortSignal.timeout(5000) })
              if (!articleResponse.ok) throw new Error('Failed to fetch article')

              const articleHtml = await articleResponse.text()
              const articleText = cheerio.load(articleHtml).text().substring(0, 5000)

              // Enqueue for AI extraction
              const publishedAt = pubDate ? Date.parse(pubDate) : Date.now()
              await enqueueExtractEvent(articleText, link, new Date(Number.isNaN(publishedAt) ? Date.now() : publishedAt))

              // Cache the URL
              if (redis) await redis.setex(cacheKey, 7 * 24 * 60 * 60, '1')

              itemsFound++
              itemsNew++
              this.logInfo(`Queued for extraction: ${title}`)
            } catch (err) {
              errors.push(this.handleItemError(`Article ${title}`, err))
            }
          } catch (err) {
            errors.push(this.handleItemError('RSS Item', err))
          }
        }
      } catch (err: unknown) {
        errors.push(this.handleItemError(`Feed ${feed}`, err))
      }
    }

    this.logInfo(`Completed: found ${itemsFound} new articles, queued ${itemsNew} for extraction`)

    return { itemsFound, itemsNew, errors }
  }
}
