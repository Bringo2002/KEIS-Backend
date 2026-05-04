import cron from 'node-cron';
import { scraperQueue } from '../queues/scraper.queue';
import { enqueueUpdateProfile, enqueueAnalyzeRisk } from '../queues/ai.queue';
import { db } from '../db';
import { players } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { logger } from '../utils/logger';
export function startSchedulers() {
    logger.info('Starting scheduled tasks');
    // CBK: every 6 hours
    cron.schedule('0 */6 * * *', () => {
        logger.info('Scheduled: CBK scraper');
        scraperQueue.add('scrape-cbk', { scraperName: 'cbk' });
    });
    // NSE: hourly, weekdays 9am-5pm EAT (adjusted for UTC)
    cron.schedule('0 6-14 * * 1-5', () => {
        logger.info('Scheduled: NSE scraper');
        scraperQueue.add('scrape-nse', { scraperName: 'nse' });
    });
    // News: every 2 hours
    cron.schedule('0 */2 * * *', () => {
        logger.info('Scheduled: News scraper');
        scraperQueue.add('scrape-news', { scraperName: 'news' });
    });
    // World Bank: daily 6am EAT (3am UTC)
    cron.schedule('0 3 * * *', () => {
        logger.info('Scheduled: World Bank scraper');
        scraperQueue.add('scrape-worldbank', { scraperName: 'worldbank' });
    });
    // Profile refresh: Sunday 2am EAT (11pm previous day UTC)
    cron.schedule('0 23 * * 0', async () => {
        logger.info('Scheduled: Profile refresh');
        try {
            const allPlayers = await db.query.players.findMany({
                where: eq(players.isActive, true),
            });
            for (const player of allPlayers) {
                await enqueueUpdateProfile(player.id);
            }
            logger.info(`Queued profile updates for ${allPlayers.length} players`);
        }
        catch (err) {
            logger.error('Profile refresh error:', err);
        }
    });
    // Risk analysis: daily 7am EAT (4am UTC)
    cron.schedule('0 4 * * *', async () => {
        logger.info('Scheduled: Risk analysis');
        try {
            const allPlayers = await db.query.players.findMany({
                where: eq(players.isActive, true),
            });
            for (const player of allPlayers) {
                await enqueueAnalyzeRisk(player.id);
            }
            logger.info(`Queued risk analysis for ${allPlayers.length} players`);
        }
        catch (err) {
            logger.error('Risk analysis error:', err);
        }
    });
    logger.info('All schedulers registered');
}
//# sourceMappingURL=scheduler.js.map