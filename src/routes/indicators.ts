import { FastifyInstance } from 'fastify'
import { IndicatorService } from '../services/indicator.service'
import { CreateIndicatorSchema, UpdateIndicatorSchema, DataPointSchema, GetIndicatorsSchema } from '../schemas/indicator.schema'

export async function indicatorsRoutes(fastify: FastifyInstance) {
  // GET /api/indicators - polling endpoint
  fastify.get('/api/indicators', async (request, reply) => {
    const params = GetIndicatorsSchema.parse(request.query)
    const offset = (params.page - 1) * params.limit

    const { data, total } = await IndicatorService.getAll(params.limit, offset)

    const pages = Math.ceil(total / params.limit)

    reply.header('X-Total-Count', total)

    return {
      data,
      total,
      page: params.page,
      pages,
    }
  })

  // GET /api/indicators/live - Server-Sent Events for real-time updates
  fastify.get('/api/indicators/live', (request, reply) => {
    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    })

    reply.raw.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`)

    const interval = setInterval(async () => {
      try {
        const { data } = await IndicatorService.getAll(10, 0) // Latest 10 indicators
        reply.raw.write(`data: ${JSON.stringify({ type: 'update', indicators: data })}\n\n`)
      } catch (err) {
        reply.raw.write(`data: ${JSON.stringify({ type: 'error', message: err instanceof Error ? err.message : String(err) })}\n\n`)
      }
    }, 30000) // Update every 30 seconds

    reply.raw.on('close', () => {
      clearInterval(interval)
    })
  })


  // GET /api/indicators/:slug
  fastify.get('/api/indicators/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string }
    const indicator = await IndicatorService.getBySlug(slug)

    if (!indicator) {
      return reply.status(404).send({ error: 'Not found', message: 'Indicator not found' })
    }

    return indicator
  })

  // POST /api/indicators
  fastify.post('/api/indicators', async (request, reply) => {
    const body = CreateIndicatorSchema.parse(request.body)
    const indicator = await IndicatorService.create(body)

    return reply.status(201).send(indicator)
  })

  // PUT /api/indicators/:slug
  fastify.put('/api/indicators/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string }
    const body = UpdateIndicatorSchema.parse(request.body)

    const indicator = await IndicatorService.update(slug, body)

    if (!indicator) {
      return reply.status(404).send({ error: 'Not found', message: 'Indicator not found' })
    }

    return indicator
  })

  // POST /api/indicators/:slug/datapoint
  fastify.post('/api/indicators/:slug/datapoint', async (request, reply) => {
    const { slug } = request.params as { slug: string }
    const body = DataPointSchema.parse(request.body)

    await IndicatorService.upsertDataPoint(slug, body.date, body.value)

    const indicator = await IndicatorService.getBySlug(slug)

    return reply.status(201).send(indicator)
  })

  // POST /api/indicators/:slug/players/:playerId
  fastify.post('/api/indicators/:slug/players/:playerId', async (request, reply) => {
    const { slug, playerId } = request.params as { slug: string; playerId: string }

    await IndicatorService.addPlayer(slug, playerId)

    return reply.status(201).send()
  })
}
