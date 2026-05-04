import { Queue, Worker } from 'bullmq';
import redis from '../redis';
import { db } from '../db';
import { scraperRuns } from '../../drizzle/schema';
import { logger } from '../utils/logger';
import { CBKScraper } from '../scrapers/cbk.scraper';
import { NSEScraper } from '../scrapers/nse.scraper';
import { NewsScraper } from '../scrapers/news.scraper';
import { WorldBankScraper } from '../scrapers/worldbank.scraper';
export const scraperQueue = new Queue('scrapers', { connection: redis });
const scraperMap = {
    cbk: CBKScraper,
    nse: NSEScraper,
    news: NewsScraper,
    worldbank: WorldBankScraper,
};
export const scraperWorker = new Worker('scrapers', async (job) => {
    const { scraperName } = job.data;
    const startedAt = new Date();
    logger.info(`Starting scraper: ${scraperName}`);
    try {
        const ScraperClass = scraperMap[scraperName];
        if (!ScraperClass) {
            throw new Error(`Unknown scraper: ${scraperName}`);
        }
        const scraper = new ScraperClass();
        const result = await scraper.run();
        // Log successful run
        await db.insert(scraperRuns).values({
            scraperName,
            status: 'SUCCESS',
            itemsFound: result.itemsFound,
            itemsNew: result.itemsNew,
            startedAt,
            completedAt: new Date(),
        });
        logger.info(`Scraper ${scraperName} completed: found ${result.itemsFound}, new ${result.itemsNew}`);
        return result;
    }
    catch (err) {
        logger.error(`Scraper ${scraperName} failed:`, err);
        // Log failed run
        await db.insert(scraperRuns).values({
            scraperName,
            status: 'FAILED',
            error: err.message,
            startedAt,
            completedAt: new Date(),
        });
        throw err;
    }
}, { connection: redis, concurrency: 2 });
scraperWorker.on('failed', (job, err) => {
    logger.error(`Job ${job?.id} failed:`, err);
});
export async function closeScraperQueue() {
    await scraperQueue.close();
    await scraperWorker.close();
}
//# sourceMappingURL=scraper.queue.js.map