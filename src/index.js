import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { config } from './config';
import { registerRoutes } from './routes';
import { startSchedulers } from './scrapers/scheduler';
import { logger } from './utils/logger';
import { closeScraperQueue } from './queues/scraper.queue';
import { closeAIQueue } from './queues/ai.queue';
import { ZodError } from 'zod';
const fastify = Fastify({
    logger: logger,
});
async function start() {
    try {
        // Register plugins
        await fastify.register(helmet);
        await fastify.register(cors, {
            origin: config.FRONTEND_URL,
        });
        await fastify.register(rateLimit, {
            max: 100,
            timeWindow: '15 minutes',
        });
        // Error handler
        fastify.setErrorHandler((err, request, reply) => {
            logger.error(err);
            // Drizzle unique constraint
            if (err.code === '23505') {
                return reply.status(409).send({
                    error: 'Conflict',
                    message: 'This resource already exists',
                });
            }
            // Zod validation error
            if (err instanceof ZodError) {
                return reply.status(400).send({
                    error: 'Validation Error',
                    issues: err.issues,
                });
            }
            // 404
            if (err.statusCode === 404) {
                return reply.status(404).send({
                    error: 'Not found',
                    message: 'Resource not found',
                });
            }
            // Anthropic errors
            if (err.status === 502) {
                return reply.status(502).send({
                    error: 'Bad Gateway',
                    message: 'AI service unavailable',
                });
            }
            // Generic error
            return reply.status(err.statusCode || 500).send({
                error: 'Internal Server Error',
                message: config.NODE_ENV === 'production' ? 'An error occurred' : err.message,
            });
        });
        // Register routes
        await registerRoutes(fastify);
        // Start schedulers
        startSchedulers();
        // Listen
        await fastify.listen({ port: config.PORT, host: '0.0.0.0' });
        logger.info(`Server running on http://0.0.0.0:${config.PORT}`);
        logger.info(`Environment: ${config.NODE_ENV}`);
    }
    catch (err) {
        logger.error(err);
        process.exit(1);
    }
}
// Graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down');
    await fastify.close();
    await closeScraperQueue();
    await closeAIQueue();
    process.exit(0);
});
process.on('SIGINT', async () => {
    logger.info('SIGINT received, shutting down');
    await fastify.close();
    await closeScraperQueue();
    await closeAIQueue();
    process.exit(0);
});
start().catch((err) => {
    logger.error(err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map