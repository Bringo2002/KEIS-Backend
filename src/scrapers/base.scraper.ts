import { ScraperResult } from '../types'
import { logger } from '../utils/logger'

export abstract class BaseScraper {
  abstract readonly name: string
  abstract run(): Promise<ScraperResult>

  protected logInfo(message: string) {
    logger.info(`[${this.name}] ${message}`)
  }

  protected logError(message: string, err?: any) {
    logger.error(`[${this.name}] ${message}`, err)
  }

  protected handleItemError(item: string, err: any): string {
    this.logError(`Error processing item ${item}`, err)
    return `Failed to process: ${err.message}`
  }
}
