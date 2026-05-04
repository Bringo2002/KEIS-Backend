import { z } from 'zod';
const QuerySchema = z.object({
    query: z.string().min(1),
});
export async function queryRoutes(fastify) {
    // POST /api/query
    fastify.post('/api/query', { config: { rateLimit: { max: 10, timeWindow: '1 minute' } } }, async (request, reply) => {
        const body = QuerySchema.parse(request.body);
        try {
            // Import queryEngine dynamically to avoid circular deps
            const { QueryEngine } = await import('../ai/queryEngine');
            const startTime = Date.now();
            const result = await QueryEngine.query(body.query);
            const latencyMs = Date.now() - startTime;
            // Log to database
            const { db } = await import('../db');
            const { queryLogs } = await import('../../drizzle/schema');
            await db.insert(queryLogs).values({
                query: body.query,
                response: JSON.stringify(result),
                latencyMs,
                promptTokens: result.usage.inputTokens,
                outputTokens: result.usage.outputTokens,
            });
            return result;
        }
        catch (err) {
            fastify.log.error(err);
            return reply.status(500).send({ error: 'Query failed', message: err.message });
        }
    });
    // GET /api/query-logs (admin)
    fastify.get('/api/admin/query-logs', async (request, reply) => {
        const { db } = await import('../db');
        const { queryLogs } = await import('../../drizzle/schema');
        const { desc } = await import('drizzle-orm');
        const logs = await db.query.queryLogs.findMany({
            orderBy: desc(queryLogs.createdAt),
            limit: 50,
        });
        const avgLatency = logs.reduce((sum, log) => sum + log.latencyMs, 0) / logs.length;
        reply.header('X-Avg-Latency-Ms', avgLatency.toFixed(2));
        return {
            data: logs,
        };
    });
}
//# sourceMappingURL=query.js.map