import { BaseScraper } from './base.scraper';
import * as cheerio from 'cheerio';
import { IndicatorService } from '../services/indicator.service';
export class CBKScraper extends BaseScraper {
    name = 'cbk';
    async run() {
        const errors = [];
        let itemsFound = 0;
        let itemsNew = 0;
        try {
            // Fetch CBK monetary policy page
            const response = await fetch('https://www.centralbank.go.ke/monetary-policy/');
            if (!response.ok)
                throw new Error(`Failed to fetch: ${response.statusText}`);
            const html = await response.text();
            const $ = cheerio.load(html);
            // Parse CBR (Central Bank Rate) - example selector (adjust based on actual HTML)
            try {
                const cbrText = $('body').text();
                const cbrMatch = cbrText.match(/Central Bank Rate[:\s]+(\d+\.?\d*)/i);
                if (cbrMatch) {
                    const cbrValue = parseFloat(cbrMatch[1]);
                    await IndicatorService.upsertDataPoint('cbr', new Date(), cbrValue);
                    itemsFound++;
                    itemsNew++;
                    this.logInfo(`CBR: ${cbrValue}%`);
                }
            }
            catch (err) {
                errors.push(this.handleItemError('CBR', err));
            }
            // Parse forex reserves - basic example
            try {
                const forexText = $('body').text();
                const forexMatch = forexText.match(/forex reserves[:\s]+\$\s*(\d+)\s*million/i);
                if (forexMatch) {
                    const forexValue = parseFloat(forexMatch[1]) * 1_000_000;
                    await IndicatorService.upsertDataPoint('forex-reserves', new Date(), forexValue);
                    itemsFound++;
                    itemsNew++;
                    this.logInfo(`Forex Reserves: $${forexMatch[1]} million`);
                }
            }
            catch (err) {
                errors.push(this.handleItemError('Forex Reserves', err));
            }
            // Parse 91-day T-bill rate
            try {
                const tbillText = $('body').text();
                const tbillMatch = tbillText.match(/91-day T-bill[:\s]+(\d+\.?\d*)%/i);
                if (tbillMatch) {
                    const tbillValue = parseFloat(tbillMatch[1]);
                    await IndicatorService.upsertDataPoint('tbill-91day', new Date(), tbillValue);
                    itemsFound++;
                    itemsNew++;
                    this.logInfo(`91-Day T-Bill: ${tbillValue}%`);
                }
            }
            catch (err) {
                errors.push(this.handleItemError('91-Day T-Bill', err));
            }
            this.logInfo(`Completed: found ${itemsFound} items`);
            return { itemsFound, itemsNew, errors };
        }
        catch (err) {
            this.logError('Fatal error', err);
            return { itemsFound, itemsNew, errors: [err.message] };
        }
    }
}
//# sourceMappingURL=cbk.scraper.js.map