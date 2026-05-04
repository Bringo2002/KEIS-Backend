import { db } from '../db'
import { economicEvents, eventPlayers, players } from '../../drizzle/schema'
import { eq, and, or, desc, asc, gte, lte } from 'drizzle-orm'
import { CreateEventInput, UpdateEventInput } from '../schemas/event.schema'

export class EventService {
  static async getAll(
    sector?: string,
    impactType?: string,
    impactLevel?: string,
    playerId?: string,
    from?: Date,
    to?: Date,
    limit: number = 20,
    offset: number = 0
  ) {
    const conditions = [
      sector ? eq(economicEvents.sectors, [sector] as any) : undefined,
      impactType ? eq(economicEvents.impactType, impactType as any) : undefined,
      impactLevel ? eq(economicEvents.impact, impactLevel as any) : undefined,
      from ? gte(economicEvents.date, from) : undefined,
      to ? lte(economicEvents.date, to) : undefined,
    ].filter(Boolean)

    let query = db.query.economicEvents.findMany({
      where: conditions.length > 0 ? and(...(conditions as any)) : undefined,
      with: {
        eventPlayers: {
          with: { player: true },
        },
      },
      orderBy: desc(economicEvents.date),
      limit,
      offset,
    })

    // Filter by playerId if provided
    let data = await query

    if (playerId) {
      data = data.filter((e) => e.eventPlayers.some((ep) => ep.playerId === playerId))
    }

    const countResult = await db
      .select({ count: economicEvents.id })
      .from(economicEvents)
      .where(conditions.length > 0 ? and(...(conditions as any)) : undefined)

    return {
      data,
      total: countResult.length,
    }
  }

  static async getById(id: string) {
    return db.query.economicEvents.findFirst({
      where: eq(economicEvents.id, id),
      with: {
        eventPlayers: {
          with: { player: true },
        },
      },
    })
  }

  static async create(input: CreateEventInput) {
    const { playerIds = [], ...eventData } = input

    const event = await db.transaction(async (tx) => {
      const result = await tx.insert(economicEvents).values({
        ...eventData,
        sectors: eventData.sectors as any,
        impactType: eventData.impactType as any,
        impact: eventData.impact as any,
      })

      const eventId = (result as any).rows?.[0]?.id

      // Get inserted event to find ID
      const inserted = await tx.query.economicEvents.findFirst({
        where: eq(economicEvents.date, eventData.date),
        orderBy: desc(economicEvents.createdAt),
      })

      if (!inserted) throw new Error('Failed to create event')

      // Add player associations
      if (playerIds.length > 0) {
        await tx.insert(eventPlayers).values(
          playerIds.map((pid) => ({
            eventId: inserted.id,
            playerId: pid,
          }))
        )
      }

      return inserted.id
    })

    return this.getById(event as string)
  }

  static async update(id: string, input: UpdateEventInput) {
    await db.update(economicEvents).set({ ...input, updatedAt: new Date() }).where(eq(economicEvents.id, id))

    return this.getById(id)
  }

  static async delete(id: string) {
    await db.delete(eventPlayers).where(eq(eventPlayers.eventId, id))
    await db.delete(economicEvents).where(eq(economicEvents.id, id))
  }

  static async addPlayer(eventId: string, playerId: string) {
    await db.insert(eventPlayers).values({ eventId, playerId }).onConflictDoNothing()
  }

  static async removePlayer(eventId: string, playerId: string) {
    await db.delete(eventPlayers).where(and(eq(eventPlayers.eventId, eventId), eq(eventPlayers.playerId, playerId)))
  }
}
