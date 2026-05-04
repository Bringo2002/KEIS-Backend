import { Queue, Worker } from 'bullmq'
import redis from '../redis'
import { config } from '../config'
import { db } from '../db'
import { scraperRuns } from '../../drizzle/schema'
import { logger } from '../utils/logger'

import { CBKScraper } from '../scrapers/cbk.scraper'
import { NSEScraper } from '../scrapers/nse.scraper'
import { NewsScraper } from '../scrapers/news.scraper'
import { WorldBankScraper } from '../scrapers/worldbank.scraper'

export const scraperQueue = redis ? new Queue('scrapers', { connection: redis }) : null

const scraperMap: Record<string, any> = {
  cbk: CBKScraper,
  nse: NSEScraper,
  news: NewsScraper,
  worldbank: WorldBankScraper,
}

export const scraperWorker = redis
  ? new Worker(
      'scrapers',
      async (job) => {
        const { scraperName } = job.data as { scraperName: string }

        const startedAt = new Date()

        logger.info(`Starting scraper: ${scraperName}`)

        try {
          const ScraperClass = scraperMap[scraperName]
          if (!ScraperClass) {
            throw new Error(`Unknown scraper: ${scraperName}`)
          }

          const scraper = new ScraperClass()
          const result = await scraper.run()

          await db.insert(scraperRuns).values({
            scraperName,
            status: 'SUCCESS',
            itemsFound: result.itemsFound,
            itemsNew: result.itemsNew,
            startedAt,
            completedAt: new Date(),
          })

          logger.info(`Scraper ${scraperName} completed: found ${result.itemsFound}, new ${result.itemsNew}`)

          return result
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err)
          logger.error(`Scraper ${scraperName} failed:`, err)

          await db.insert(scraperRuns).values({
            scraperName,
            status: 'FAILED',
            error: message,
            startedAt,
            completedAt: new Date(),
          })

          throw err
        }
      },
      { connection: redis, concurrency: 2 }
    )
  : null

scraperWorker?.on('failed', (job, err) => {
  logger.error(`Job ${job?.id} failed:`, err)
})

export async function closeScraperQueue() {
  await scraperQueue?.close()
  await scraperWorker?.close()
}
