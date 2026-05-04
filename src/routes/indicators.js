import { IndicatorService } from '../services/indicator.service';
import { CreateIndicatorSchema, UpdateIndicatorSchema, DataPointSchema, GetIndicatorsSchema } from '../schemas/indicator.schema';
export async function indicatorsRoutes(fastify) {
    // GET /api/indicators
    fastify.get('/api/indicators', async (request, reply) => {
        const params = GetIndicatorsSchema.parse(request.query);
        const offset = (params.page - 1) * params.limit;
        const { data, total } = await IndicatorService.getAll(params.limit, offset);
        const pages = Math.ceil(total / params.limit);
        reply.header('X-Total-Count', total);
        return {
            data,
            total,
            page: params.page,
            pages,
        };
    });
    // GET /api/indicators/:slug
    fastify.get('/api/indicators/:slug', async (request, reply) => {
        const { slug } = request.params;
        const indicator = await IndicatorService.getBySlug(slug);
        if (!indicator) {
            return reply.status(404).send({ error: 'Not found', message: 'Indicator not found' });
        }
        return indicator;
    });
    // POST /api/indicators
    fastify.post('/api/indicators', async (request, reply) => {
        const body = CreateIndicatorSchema.parse(request.body);
        const indicator = await IndicatorService.create(body);
        return reply.status(201).send(indicator);
    });
    // PUT /api/indicators/:slug
    fastify.put('/api/indicators/:slug', async (request, reply) => {
        const { slug } = request.params;
        const body = UpdateIndicatorSchema.parse(request.body);
        const indicator = await IndicatorService.update(slug, body);
        if (!indicator) {
            return reply.status(404).send({ error: 'Not found', message: 'Indicator not found' });
        }
        return indicator;
    });
    // POST /api/indicators/:slug/datapoint
    fastify.post('/api/indicators/:slug/datapoint', async (request, reply) => {
        const { slug } = request.params;
        const body = DataPointSchema.parse(request.body);
        await IndicatorService.upsertDataPoint(slug, body.date, body.value);
        const indicator = await IndicatorService.getBySlug(slug);
        return reply.status(201).send(indicator);
    });
    // POST /api/indicators/:slug/players/:playerId
    fastify.post('/api/indicators/:slug/players/:playerId', async (request, reply) => {
        const { slug, playerId } = request.params;
        await IndicatorService.addPlayer(slug, playerId);
        return reply.status(201).send();
    });
}
//# sourceMappingURL=indicators.js.map