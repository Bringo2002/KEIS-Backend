import { db } from '../db'
import { players, relationships, economicEvents, eventPlayers, playerProfileHistory } from '../../drizzle/schema'
import { eq, and, or, ilike, desc, asc, lt } from 'drizzle-orm'
import { CreatePlayerInput, UpdatePlayerInput } from '../schemas/player.schema'
import slugify from 'slugify'

export class PlayerService {
  static async getAll(
    sector?: string,
    type?: string,
    tags?: string[],
    search?: string,
    riskLevel?: string,
    limit: number = 20,
    offset: number = 0
  ) {
    const conditions = [
      eq(players.isActive, true),
      sector ? eq(players.sector, sector as any) : undefined,
      type ? eq(players.type, type as any) : undefined,
      search ? or(ilike(players.name, `%${search}%`), ilike(players.description, `%${search}%`)) : undefined,
      riskLevel ? eq(players.riskLevel, riskLevel as any) : undefined,
      tags && tags.length > 0 ? and(...tags.map((tag) => ilike(players.tags as any, `%${tag}%`))) : undefined,
    ].filter(Boolean)

    const [data, countResult] = await Promise.all([
      db.query.players.findMany({
        where: conditions.length > 0 ? and(...(conditions as any)) : undefined,
        with: {
          relationshipsFrom: {
            with: { target: true },
          },
          relationshipsTo: {
            with: { source: true },
          },
          eventPlayers: {
            with: { event: true },
            limit: 10,
            orderBy: desc(economicEvents.date),
          },
        },
        limit,
        offset,
        orderBy: asc(players.name),
      }),
      db
        .select({ count: players.id })
        .from(players)
        .where(conditions.length > 0 ? and(...(conditions as any)) : undefined),
    ])

    const total = countResult[0]?.count ? Object.keys(countResult[0]).length : 0

    return { data, total }
  }

  static async getBySlug(slug: string) {
    const player = await db.query.players.findFirst({
      where: eq(players.slug, slug),
      with: {
        relationshipsFrom: {
          with: { target: true },
        },
        relationshipsTo: {
          with: { source: true },
        },
        eventPlayers: {
          with: { event: true },
          limit: 10,
          orderBy: desc(economicEvents.date),
        },
      },
    })

    return player
  }

  static async create(input: CreatePlayerInput) {
    const slug = slugify(input.slug || input.name, { lower: true, strict: true })

    // Check if slug already exists
    const existing = await db.query.players.findFirst({
      where: eq(players.slug, slug),
    })

    if (existing) {
      throw new Error('Player with this slug already exists')
    }

    const result = await db.insert(players).values({
      ...input,
      slug,
    })

    return this.getBySlug(slug)
  }

  static async update(slug: string, input: UpdatePlayerInput) {
    // Get current player to snapshot old values
    const current = await this.getBySlug(slug)
    if (!current) throw new Error('Player not found')

    // If description, keyFacts, or riskLevel changed, snapshot old values
    if (input.description || input.keyFacts || input.riskLevel) {
      await db.insert(playerProfileHistory).values({
        playerId: current.id,
        description: current.description,
        keyFacts: current.keyFacts,
        riskLevel: current.riskLevel,
      })
    }

    await db
      .update(players)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(players.slug, slug))

    return this.getBySlug(slug)
  }

  static async delete(slug: string) {
    await db.update(players).set({ isActive: false }).where(eq(players.slug, slug))
  }

  static async getRelationships(playerId: string) {
    return db.query.relationships.findMany({
      where: or(eq(relationships.sourceId, playerId), eq(relationships.targetId, playerId)),
      with: {
        source: true,
        target: true,
      },
    })
  }
}
