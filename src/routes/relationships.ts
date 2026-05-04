import { FastifyInstance } from 'fastify'
import { RelationshipService } from '../services/relationship.service'
import { CreateRelationshipSchema, UpdateRelationshipSchema, GetRelationshipsSchema } from '../schemas/relationship.schema'

export async function relationshipsRoutes(fastify: FastifyInstance) {
  // GET /api/relationships
  fastify.get('/api/relationships', async (request, reply) => {
    const params = GetRelationshipsSchema.parse(request.query)
    const offset = (params.page - 1) * params.limit

    const { data, total } = await RelationshipService.getAll(params.playerId, params.type, params.limit, offset)

    const pages = Math.ceil(total / params.limit)

    reply.header('X-Total-Count', total)

    return {
      data,
      total,
      page: params.page,
      pages,
    }
  })

  // GET /api/relationships/:id
  fastify.get('/api/relationships/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const relationship = await RelationshipService.getById(id)

    if (!relationship) {
      return reply.status(404).send({ error: 'Not found', message: 'Relationship not found' })
    }

    return relationship
  })

  // POST /api/relationships
  fastify.post('/api/relationships', async (request, reply) => {
    const body = CreateRelationshipSchema.parse(request.body)

    try {
      const relationship = await RelationshipService.create(body)
      return reply.status(201).send(relationship)
    } catch (err: any) {
      if (err.message.includes('already exists')) {
        return reply.status(409).send({ error: 'Conflict', message: err.message })
      }
      if (err.message.includes('not found')) {
        return reply.status(404).send({ error: 'Not found', message: err.message })
      }
      throw err
    }
  })

  // PUT /api/relationships/:id
  fastify.put('/api/relationships/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const body = UpdateRelationshipSchema.parse(request.body)

    const relationship = await RelationshipService.update(id, body)

    if (!relationship) {
      return reply.status(404).send({ error: 'Not found', message: 'Relationship not found' })
    }

    return relationship
  })

  // DELETE /api/relationships/:id
  fastify.delete('/api/relationships/:id', async (request, reply) => {
    const { id } = request.params as { id: string }

    const relationship = await RelationshipService.getById(id)
    if (!relationship) {
      return reply.status(404).send({ error: 'Not found', message: 'Relationship not found' })
    }

    await RelationshipService.delete(id)

    return reply.status(204).send()
  })
}
