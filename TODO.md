# KIS-Backend Real-Time Data Pipeline TODO

## Current Status: [In Progress]

### 1. [IN-PROGRESS] Enhance scraper selectors for reliability (waiting Playwright HTML inspection)
   - Update cbk.scraper.ts: Fix CBR/forex/T-bill selectors
   - Update nse.scraper.ts: Fix NSE20/share prices  
   - Update news.scraper.ts: Robust RSS/article parsing
   - Files: src/scrapers/cbk.scraper.ts, nse.scraper.ts, news.scraper.ts

### 2. [COMPLETE ✅] Improve scheduler for real-time frequency
   - Set cron: NSE/CBK every 5min (market hours), News/WorldBank hourly
   - Files: src/scrapers/scheduler.ts

### 3. [COMPLETE ✅] Implement scraper.queue.ts worker
   - Process 'scrape-{name}' jobs → scraper.run()
   - Files: src/queues/scraper.queue.ts

### 4. [COMPLETE ✅] Add real-time SSE endpoint
   - GET /api/indicators/live (stream updates)
   - Files: src/routes/indicators.ts

### 5. [PENDING] Setup & verify infrastructure
   - pnpm install, drizzle migrate, pnpm dev
   - Test endpoints, monitor queues/logs

### 6. [PENDING] Test end-to-end pipeline
   - Trigger scrapers, check DB inserts, API responses

**Next step: Add SSE endpoint (Step 4)**

