import { logger } from '../utils/logger';
export class BaseScraper {
    logInfo(message) {
        logger.info(`[${this.name}] ${message}`);
    }
    logError(message, err) {
        logger.error(`[${this.name}] ${message}`, err);
    }
    handleItemError(item, err) {
        this.logError(`Error processing item ${item}`, err);
        return `Failed to process: ${err.message}`;
    }
}
//# sourceMappingURL=base.scraper.js.map