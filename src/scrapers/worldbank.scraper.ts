import { BaseScraper } from './base.scraper'
import { ScraperResult } from '../types'
import { IndicatorService } from '../services/indicator.service'

const INDICATORS = [
  { code: 'NY.GDP.MKTP.KD.ZG', slug: 'gdp-growth', name: 'GDP Growth (%)' },
  { code: 'FP.CPI.TOTL.ZG', slug: 'inflation', name: 'Inflation (%)' },
  { code: 'GC.DOD.TOTL.GD.ZS', slug: 'debt-gdp', name: 'Debt to GDP (%)' },
]

export class WorldBankScraper extends BaseScraper {
  readonly name = 'worldbank'

  async run(): Promise<ScraperResult> {
    const errors: string[] = []
    let itemsFound = 0
    let itemsNew = 0

    for (const indicator of INDICATORS) {
      try {
        const url = `https://api.worldbank.org/v2/country/KEN/indicator/${indicator.code}?format=json&per_page=24&date=2000:2024`

        const response = await fetch(url, { signal: AbortSignal.timeout(10000) })
        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`)

        const data = (await response.json()) as any

        if (!data[1] || !Array.isArray(data[1])) {
          this.logError(`Invalid response for ${indicator.name}`)
          continue
        }

        // Process last 24 months
        const dataPoints = data[1]
          .filter((d: any) => d.value !== null)
          .sort((a: any, b: any) => parseInt(b.date) - parseInt(a.date))
          .slice(0, 24)

        for (const dp of dataPoints.reverse()) {
          try {
            const date = new Date(`${dp.date}-12-31`)
            const value = parseFloat(dp.value)

            await IndicatorService.upsertDataPoint(indicator.slug, date, value)

            itemsFound++
            itemsNew++
            this.logInfo(`${indicator.name} (${dp.date}): ${value}`)
          } catch (err) {
            errors.push(this.handleItemError(`${indicator.name} ${dp.date}`, err))
          }
        }
      } catch (err: any) {
        errors.push(this.handleItemError(`Indicator ${indicator.code}`, err))
      }
    }

    this.logInfo(`Completed: found ${itemsFound} items`)

    return { itemsFound, itemsNew, errors }
  }
}
