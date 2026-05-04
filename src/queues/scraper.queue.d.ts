import { Queue, Worker } from 'bullmq';
export declare const scraperQueue: Queue<any, any, string, any, any, string>;
export declare const scraperWorker: Worker<any, any, string>;
export declare function closeScraperQueue(): Promise<void>;
//# sourceMappingURL=scraper.queue.d.ts.map