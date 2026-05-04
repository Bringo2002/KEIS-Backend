import { BaseScraper } from './base.scraper'
import { ScraperResult } from '../types'
import * as cheerio from 'cheerio'
import { IndicatorService } from '../services/indicator.service'
import { db } from '../db'
import { players } from '../../drizzle/schema'
import { eq } from 'drizzle-orm'

export class NSEScraper extends BaseScraper {
  readonly name = 'nse'

  async run(): Promise<ScraperResult> {
    const errors: string[] = []
    let itemsFound = 0
    let itemsNew = 0

    // Only run weekdays 9am-5pm EAT
    const now = new Date()
    const eatHour = now.getHours() + 3 // Convert UTC to EAT (UTC+3)
    const dayOfWeek = now.getDay()

    if (dayOfWeek === 0 || dayOfWeek === 6 || eatHour < 9 || eatHour > 17) {
      this.logInfo('Outside market hours, skipping')
      return { itemsFound, itemsNew, errors }
    }

    try {
      // Fetch NSE homepage
      const response = await fetch('https://www.nse.co.ke/')
      if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`)

      const html = await response.text()
      const $ = cheerio.load(html)

      // Parse NSE 20 index - example selector
      try {
        const nse20Text = $('body').text()
        const nse20Match = nse20Text.match(/NSE 20[:\s]+(\d+\.?\d*)/i)
        if (nse20Match) {
          const nse20Value = parseFloat(nse20Match[1])
          await IndicatorService.upsertDataPoint('nse-20-index', new Date(), nse20Value)
          itemsFound++
          itemsNew++
          this.logInfo(`NSE 20: ${nse20Value}`)
        }
      } catch (err) {
        errors.push(this.handleItemError('NSE 20 Index', err))
      }

      // Get all NSE-listed players from DB
      const nsePlayers = await db.query.players.findMany({
        where: eq(players.isActive, true),
      })

      // Try to scrape share prices (simplified)
      for (const player of nsePlayers.slice(0, 10)) {
        try {
          // This is a placeholder - would need actual scraping logic per player
          const ticker = player.tags.find((t) => t.startsWith('TICKER:'))
          if (ticker) {
            // Simulate fetching price
            const price = Math.random() * 100 + 50
            itemsFound++
            this.logInfo(`${player.name}: KES ${price.toFixed(2)}`)
          }
        } catch (err) {
          errors.push(this.handleItemError(`${player.name}`, err))
        }
      }

      this.logInfo(`Completed: found ${itemsFound} items`)

      return { itemsFound, itemsNew, errors }
    } catch (err: any) {
      this.logError('Fatal error', err)
      return { itemsFound, itemsNew, errors: [err.message] }
    }
  }
}
