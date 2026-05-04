import { EventService } from '../services/event.service';
import { CreateEventSchema, UpdateEventSchema, GetEventsSchema } from '../schemas/event.schema';
export async function eventsRoutes(fastify) {
    // GET /api/events
    fastify.get('/api/events', async (request, reply) => {
        const params = GetEventsSchema.parse(request.query);
        const offset = (params.page - 1) * params.limit;
        const { data, total } = await EventService.getAll(params.sector, params.impactType, params.impactLevel, params.playerId, params.from, params.to, params.limit, offset);
        const pages = Math.ceil(total / params.limit);
        reply.header('X-Total-Count', total);
        return {
            data,
            total,
            page: params.page,
            pages,
        };
    });
    // GET /api/events/:id
    fastify.get('/api/events/:id', async (request, reply) => {
        const { id } = request.params;
        const event = await EventService.getById(id);
        if (!event) {
            return reply.status(404).send({ error: 'Not found', message: 'Event not found' });
        }
        return event;
    });
    // POST /api/events
    fastify.post('/api/events', async (request, reply) => {
        const body = CreateEventSchema.parse(request.body);
        const event = await EventService.create(body);
        return reply.status(201).send(event);
    });
    // PUT /api/events/:id
    fastify.put('/api/events/:id', async (request, reply) => {
        const { id } = request.params;
        const body = UpdateEventSchema.parse(request.body);
        const event = await EventService.update(id, body);
        if (!event) {
            return reply.status(404).send({ error: 'Not found', message: 'Event not found' });
        }
        return event;
    });
    // DELETE /api/events/:id
    fastify.delete('/api/events/:id', async (request, reply) => {
        const { id } = request.params;
        const event = await EventService.getById(id);
        if (!event) {
            return reply.status(404).send({ error: 'Not found', message: 'Event not found' });
        }
        await EventService.delete(id);
        return reply.status(204).send();
    });
    // POST /api/events/:id/players/:playerId
    fastify.post('/api/events/:id/players/:playerId', async (request, reply) => {
        const { id, playerId } = request.params;
        await EventService.addPlayer(id, playerId);
        const event = await EventService.getById(id);
        return reply.status(201).send(event);
    });
    // DELETE /api/events/:id/players/:playerId
    fastify.delete('/api/events/:id/players/:playerId', async (request, reply) => {
        const { id, playerId } = request.params;
        await EventService.removePlayer(id, playerId);
        return reply.status(204).send();
    });
}
//# sourceMappingURL=events.js.map