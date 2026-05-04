import { FastifyInstance } from 'fastify'
import { playersRoutes } from './players'
import { eventsRoutes } from './events'
import { indicatorsRoutes } from './indicators'
import { relationshipsRoutes } from './relationships'
import { sectorsRoutes } from './sectors'
import { queryRoutes } from './query'
import { adminRoutes } from './admin'

export async function registerRoutes(fastify: FastifyInstance) {
  await fastify.register(playersRoutes)
  await fastify.register(eventsRoutes)
  await fastify.register(indicatorsRoutes)
  await fastify.register(relationshipsRoutes)
  await fastify.register(sectorsRoutes)
  await fastify.register(queryRoutes)
  await fastify.register(adminRoutes)

  // Health check
  fastify.get('/api/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  })
}
