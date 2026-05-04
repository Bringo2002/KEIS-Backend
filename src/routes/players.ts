import { FastifyInstance } from 'fastify'
import { PlayerService } from '../services/player.service'
import { CreatePlayerSchema, UpdatePlayerSchema, GetPlayersSchema } from '../schemas/player.schema'
import { ZodError } from 'zod'

export async function playersRoutes(fastify: FastifyInstance) {
  // GET /api/players
  fastify.get('/api/players', async (request, reply) => {
    const params = GetPlayersSchema.parse(request.query)
    const offset = (params.page - 1) * params.limit
    const tags = params.tags ? params.tags.split(',').map((t) => t.trim()) : []

    const { data, total } = await PlayerService.getAll(params.sector, params.type, tags, params.search, params.riskLevel, params.limit, offset)

    const pages = Math.ceil(total / params.limit)

    reply.header('X-Total-Count', total)

    return {
      data,
      total,
      page: params.page,
      pages,
    }
  })

  // GET /api/players/:slug
  fastify.get('/api/players/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string }
    const player = await PlayerService.getBySlug(slug)

    if (!player) {
      return reply.status(404).send({ error: 'Not found', message: 'Player not found' })
    }

    return player
  })

  // POST /api/players
  fastify.post('/api/players', async (request, reply) => {
    const body = CreatePlayerSchema.parse(request.body)
    const player = await PlayerService.create(body)

    return reply.status(201).send(player)
  })

  // PUT /api/players/:slug
  fastify.put('/api/players/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string }
    const body = UpdatePlayerSchema.parse(request.body)

    const player = await PlayerService.update(slug, body)

    if (!player) {
      return reply.status(404).send({ error: 'Not found', message: 'Player not found' })
    }

    return player
  })

  // DELETE /api/players/:slug
  fastify.delete('/api/players/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string }

    const player = await PlayerService.getBySlug(slug)
    if (!player) {
      return reply.status(404).send({ error: 'Not found', message: 'Player not found' })
    }

    await PlayerService.delete(slug)

    return reply.status(204).send()
  })
}
