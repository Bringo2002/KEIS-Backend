import { FastifyInstance } from 'fastify'
import { db } from '../db'
import { players, economicEvents, eventPlayers, sectorEnum } from '../../drizzle/schema'
import { eq, and, gte, desc } from 'drizzle-orm'

export async function sectorsRoutes(fastify: FastifyInstance) {
  // GET /api/sectors
  fastify.get('/api/sectors', async (request, reply) => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const allSectors = ['BANKING', 'TELECOMMUNICATIONS', 'ENERGY', 'MANUFACTURING', 'AGRICULTURE', 'REAL_ESTATE', 'GOVERNMENT', 'REGULATION', 'DIVERSIFIED', 'INSURANCE', 'FINTECH', 'RETAIL', 'MEDIA', 'TRANSPORT']

    const result: any[] = []

    for (const sector of allSectors) {
      // Count players in sector
      const playerCount = await db
        .select({ count: players.id })
        .from(players)
        .where(and(eq(players.sector, sector as any), eq(players.isActive, true)))

      // Get events in last 30 days for sector
      const recentEvents = await db.query.economicEvents.findMany({
        where: gte(economicEvents.date, thirtyDaysAgo),
        orderBy: desc(economicEvents.date),
  limit: 100,
      })

      const sectorEvents = recentEvents.filter((e) => e.sectors.includes(sector as any))

      // Get top 3 players in sector
      const topPlayers = await db.query.players.findMany({
        where: and(eq(players.sector, sector as any), eq(players.isActive, true)),
        limit: 3,
        orderBy: desc(players.updatedAt),
      })

      result.push({
        sector,
        playerCount: playerCount[0]?.count || 0,
        eventsLast30Days: sectorEvents.length,
        topPlayers: topPlayers.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
        })),
      })
    }

    return {
      data: result,
    }
  })
}
