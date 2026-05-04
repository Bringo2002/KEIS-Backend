import { FastifyInstance } from 'fastify'
import { z } from 'zod'

const ScrapeSchema = z.object({
  scraperName: z.enum(['cbk', 'nse', 'news', 'worldbank']),
})

export async function adminRoutes(fastify: FastifyInstance) {
  // POST /api/admin/scrape/:scraperName
  fastify.post('/api/admin/scrape/:scraperName', async (request, reply) => {
    const { scraperName } = request.params as { scraperName: string }

    try {
      // Validate scraper name
      ScrapeSchema.parse({ scraperName })

      // Import queues dynamically
      const { scraperQueue } = await import('../queues/scraper.queue')

      const job = await scraperQueue.add(
        `scrape-${scraperName}`,
        { scraperName },
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 5000,
          },
        }
      )

      return reply.status(202).send({
        jobId: job.id,
        scraperName,
        status: 'queued',
      })
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Invalid scraper', message: err.issues[0].message })
      }

      fastify.log.error(err)
      return reply.status(500).send({ error: 'Failed to queue scraper', message: err.message })
    }
  })

  // GET /api/admin/scraper-runs
  fastify.get('/api/admin/scraper-runs', async (request, reply) => {
    const { db } = await import('../db')
    const { scraperRuns } = await import('../../drizzle/schema')
    const { desc } = await import('drizzle-orm')

    const runs = await db.query.scraperRuns.findMany({
      orderBy: desc(scraperRuns.startedAt),
      limit: 20,
    })

    return {
      data: runs,
    }
  })
}
