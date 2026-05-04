import { BaseScraper } from './base.scraper';
import * as cheerio from 'cheerio';
import redis from '../redis';
import { enqueueExtractEvent } from '../queues/ai.queue';
const RSS_FEEDS = [
    'https://feeds.businessdailyafrica.com/feed/',
    'https://feeds.nation.co.ke/feeds/rss/20180328/39146/',
];
export class NewsScraper extends BaseScraper {
    name = 'news';
    async run() {
        const errors = [];
        let itemsFound = 0;
        let itemsNew = 0;
        for (const feed of RSS_FEEDS) {
            try {
                const response = await fetch(feed, { signal: AbortSignal.timeout(10000) });
                if (!response.ok)
                    throw new Error(`Failed to fetch: ${response.statusText}`);
                const xml = await response.text();
                const $ = cheerio.load(xml);
                // Parse RSS items
                const items = $('item').slice(0, 10); // Get latest 10
                for (const item of items) {
                    try {
                        const title = $(item).find('title').text();
                        const link = $(item).find('link').text();
                        const pubDate = $(item).find('pubDate').text();
                        if (!title || !link)
                            continue;
                        // Check if URL already cached (7-day TTL)
                        const cacheKey = `news-url:${link}`;
                        const cached = await redis.get(cacheKey);
                        if (cached) {
                            this.logInfo(`URL already processed: ${link}`);
                            continue;
                        }
                        // Fetch full article
                        try {
                            const articleResponse = await fetch(link, { signal: AbortSignal.timeout(5000) });
                            if (!articleResponse.ok)
                                throw new Error('Failed to fetch article');
                            const articleHtml = await articleResponse.text();
                            const articleText = cheerio.load(articleHtml).text().substring(0, 5000);
                            // Enqueue for AI extraction
                            await enqueueExtractEvent(articleText, link, new Date(pubDate || Date.now()));
                            // Cache the URL
                            await redis.setex(cacheKey, 7 * 24 * 60 * 60, '1');
                            itemsFound++;
                            itemsNew++;
                            this.logInfo(`Queued for extraction: ${title}`);
                        }
                        catch (err) {
                            errors.push(this.handleItemError(`Article ${title}`, err));
                        }
                    }
                    catch (err) {
                        errors.push(this.handleItemError('RSS Item', err));
                    }
                }
            }
            catch (err) {
                errors.push(this.handleItemError(`Feed ${feed}`, err));
            }
        }
        this.logInfo(`Completed: found ${itemsFound} new articles, queued ${itemsNew} for extraction`);
        return { itemsFound, itemsNew, errors };
    }
}
//# sourceMappingURL=news.scraper.js.map