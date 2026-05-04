import { BaseScraper } from './base.scraper'
import { ScraperResult } from '../types'
import * as cheerio from 'cheerio'
import { IndicatorService } from '../services/indicator.service'

export class CBKScraper extends BaseScraper {
  readonly name = 'cbk'

  /** Slugs must match `drizzle/seed.ts` macroIndicators rows */
  private static readonly URLS = [
    'https://www.centralbank.go.ke/monetary-policy/',
    'https://www.centralbank.go.ke/',
  ] as const

  async run(): Promise<ScraperResult> {
    const errors: string[] = []
    let itemsFound = 0
    let itemsNew = 0

    try {
      let bodyText = ''
      for (const url of CBKScraper.URLS) {
        try {
          const response = await fetch(url, { signal: AbortSignal.timeout(15000) })
          if (!response.ok) continue
          const html = await response.text()
          bodyText += '\n' + cheerio.load(html)('body').text()
        } catch (err) {
          errors.push(this.handleItemError(`Fetch ${url}`, err))
        }
      }

      if (!bodyText.trim()) {
        throw new Error('Could not fetch any CBK pages')
      }

      const collapsed = bodyText.replace(/\s+/g, ' ')

      // Parse CBR — slug `cbr-rate` in seed
      try {
        const cbrMatch =
          collapsed.match(/Central Bank Rate[^0-9]*(\d+\.?\d*)\s*%/i) ||
          collapsed.match(/\bCBR\b[^0-9]*(\d+\.?\d*)\s*%/i)
        if (cbrMatch) {
          const cbrValue = parseFloat(cbrMatch[1])
          await IndicatorService.upsertDataPoint('cbr-rate', new Date(), cbrValue)
          itemsFound++
          itemsNew++
          this.logInfo(`CBR: ${cbrValue}%`)
        }
      } catch (err) {
        errors.push(this.handleItemError('CBR', err))
      }

      // Forex reserves — seed uses **months of import cover**, not USD millions
      try {
        const coverMatch =
          collapsed.match(/import cover[^0-9]*(\d+\.?\d*)\s*months?/i) ||
          collapsed.match(/(\d+\.?\d*)\s*months?\s+of\s+import cover/i)
        if (coverMatch) {
          const months = parseFloat(coverMatch[1])
          await IndicatorService.upsertDataPoint('forex-reserves', new Date(), months)
          itemsFound++
          itemsNew++
          this.logInfo(`Forex reserves (import cover): ${months} months`)
        }
      } catch (err) {
        errors.push(this.handleItemError('Forex reserves', err))
      }

      // 91-day T-bill — slug `tbill-91-day`
      try {
        const tbillMatch =
          collapsed.match(/91[- ]day[^0-9]*(\d+\.?\d*)\s*%/i) ||
          collapsed.match(/91D[^0-9]*(\d+\.?\d*)\s*%/i)
        if (tbillMatch) {
          const tbillValue = parseFloat(tbillMatch[1])
          await IndicatorService.upsertDataPoint('tbill-91-day', new Date(), tbillValue)
          itemsFound++
          itemsNew++
          this.logInfo(`91-Day T-Bill: ${tbillValue}%`)
        }
      } catch (err) {
        errors.push(this.handleItemError('91-Day T-Bill', err))
      }

      this.logInfo(`Completed: found ${itemsFound} items`)

      return { itemsFound, itemsNew, errors }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      this.logError('Fatal error', err)
      return { itemsFound, itemsNew, errors: [...errors, message] }
    }
  }
}
