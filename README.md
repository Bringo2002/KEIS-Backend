# Kenya Economy Intelligence System - Phase 2 Backend

A production-ready backend for the Kenya Economy Intelligence System built with Node.js, Fastify, PostgreSQL, and Redis.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- pnpm

### Setup

1. **Clone and install:**
   ```bash
   cd KIS-Backend
   pnpm install
   ```

2. **Start infrastructure:**
   ```bash
   docker-compose up -d
   ```

3. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your Anthropic API key
   ```

4. **Initialize database:**
   ```bash
   pnpm db:generate
   pnpm db:migrate
   pnpm db:seed
   ```

5. **Start development server:**
   ```bash
   pnpm dev
   ```

Server runs on `http://localhost:3001`

## 📁 Project Structure

```
src/
├── routes/          # API endpoints
├── services/        # Business logic & DB access
├── schemas/         # Zod validation schemas
├── types/           # TypeScript types
├── ai/              # AI layer (Claude integration)
├── scrapers/        # Data scrapers
├── queues/          # BullMQ queues & workers
├── utils/           # Utilities (logger, etc.)
└── __tests__/       # Tests

drizzle/
├── schema.ts        # Database schema
├── seed.ts          # Seed script
└── migrations/      # Auto-generated migrations
```

## 🗄️ Database

### Schema Overview
- **players**: Economic entities (companies, regulators, etc.)
- **relationships**: Connections between players
- **economicEvents**: News and events affecting economy
- **macroIndicators**: Economic metrics (GDP, inflation, etc.)
- **queryLogs**: AI query history
- **scraperRuns**: Scraper execution logs

### Migrations
```bash
pnpm db:generate   # Create migration
pnpm db:migrate    # Apply migrations
pnpm db:studio    # Open Drizzle Studio UI
```

## 🔄 Scrapers & Scheduling

Automatic data collection:
- **CBK**: Central Bank data (every 6 hours)
- **NSE**: Stock market data (hourly, weekdays)
- **News**: Article extraction & AI analysis (every 2 hours)
- **World Bank**: Macro indicators (daily 6am EAT)

Manual trigger:
```bash
POST /api/admin/scrape/cbk
POST /api/admin/scrape/nse
POST /api/admin/scrape/news
POST /api/admin/scrape/worldbank
```

## 🤖 AI Features

### Query Engine
Power natural language queries about Kenya's economy:
```bash
POST /api/query
{ "query": "What banks faced headwinds in Q3?" }
```

### Event Extraction
Automatically extract economically significant events from news articles.

### Profile Updates
Weekly AI-driven updates to player descriptions based on recent events.

### Risk Analysis
Daily risk assessment for economic entities using AI analysis.

## 📊 API Endpoints

### Players
- `GET /api/players` - List all players (paginated, filterable)
- `GET /api/players/:slug` - Get player details
- `POST /api/players` - Create player
- `PUT /api/players/:slug` - Update player
- `DELETE /api/players/:slug` - Soft delete player

### Events
- `GET /api/events` - List events (filterable by date, sector, etc.)
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Indicators
- `GET /api/indicators` - List indicators
- `GET /api/indicators/:slug` - Full time series
- `POST /api/indicators/:slug/datapoint` - Add data point

### Relationships
- `GET /api/relationships` - List relationships
- `POST /api/relationships` - Create relationship
- `DELETE /api/relationships/:id` - Delete relationship

### Admin
- `POST /api/admin/scrape/:scraperName` - Trigger scraper
- `GET /api/admin/scraper-runs` - View scraper history
- `GET /api/admin/query-logs` - View query history

### Health
- `GET /api/health` - Health check

## 🧪 Testing

```bash
# Run tests
pnpm test

# With coverage
pnpm test:coverage

# Type checking
pnpm typecheck
```

All services use mock databases in test environment.

## 🔐 Error Handling

Standard error responses (all responses include proper HTTP status codes):

- `400 Bad Request` - Validation errors (Zod)
- `404 Not Found` - Resource not found
- `409 Conflict` - Unique constraint violation
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error
- `502 Bad Gateway` - AI service unavailable

## 📝 Logging

Structured logging with Pino:
- Console output (`pino-pretty`) in development
- JSON structured logs in production
- Configurable log level via `LOG_LEVEL` env var

## 🚢 Deployment

### With Docker
```bash
docker build -t kis-backend .
docker run -e DATABASE_URL=... -e REDIS_URL=... kis-backend
```

### With Azure
```bash
pnpm build
az containerapp create --image kis-backend:latest ...
```

## 📚 Documentation

- API docs available at `/api/swagger` (Swagger UI)
- Drizzle Studio: `pnpm db:studio`
- See `.env.example` for all configuration options

## 🛠️ Development

### Add a new route
1. Create schema in `src/schemas/`
2. Create service in `src/services/`
3. Create route handler in `src/routes/`
4. Register in `src/routes/index.ts`
5. Add tests in `src/__tests__/`

### Add a new scraper
1. Extend `BaseScraper` in `src/scrapers/`
2. Register in `src/queues/scraper.queue.ts`
3. Add cron schedule in `src/scrapers/scheduler.ts`

## 📋 Rules

- All files are `.ts` - no `.js`
- No `any` types - strict TypeScript
- All DB access through services
- Use `pnpm` (not npm or yarn)
- All dates stored UTC
- Pagination with `X-Total-Count` header
- No console.log - use Pino logger

## 💾 Build & Start

```bash
# Development
pnpm dev

# Production
pnpm build
pnpm start

# Both
pnpm build && pnpm start
```

## ✨ Features

✅ Drizzle ORM with PostgreSQL  
✅ Fastify HTTP server  
✅ Redis queues (BullMQ)  
✅ AI integration (Anthropic Claude)  
✅ Web scraping (Cheerio, Playwright)  
✅ Cron scheduling (node-cron)  
✅ Request validation (Zod)  
✅ Structured logging (Pino)  
✅ Rate limiting  
✅ CORS & security headers  

---

Built with ❤️ for Kenya's economic intelligence.
