import { ScraperResult } from '../types';
export declare abstract class BaseScraper {
    abstract readonly name: string;
    abstract run(): Promise<ScraperResult>;
    protected logInfo(message: string): void;
    protected logError(message: string, err?: any): void;
    protected handleItemError(item: string, err: any): string;
}
//# sourceMappingURL=base.scraper.d.ts.map