import { db } from '../db'
import { relationships, players } from '../../drizzle/schema'
import { eq, or, and, asc, desc } from 'drizzle-orm'
import { CreateRelationshipInput, UpdateRelationshipInput } from '../schemas/relationship.schema'

export class RelationshipService {
  static async getAll(playerId?: string, type?: string, limit: number = 20, offset: number = 0) {
    const conditions = [
      playerId ? or(eq(relationships.sourceId, playerId), eq(relationships.targetId, playerId)) : undefined,
      type ? eq(relationships.type, type as any) : undefined,
    ].filter(Boolean)

    const [data, countResult] = await Promise.all([
      db.query.relationships.findMany({
        where: conditions.length > 0 ? and(...(conditions as any)) : undefined,
        with: {
          source: true,
          target: true,
        },
        orderBy: asc(relationships.createdAt),
        limit,
        offset,
      }),
      db
        .select({ count: relationships.id })
        .from(relationships)
        .where(conditions.length > 0 ? and(...(conditions as any)) : undefined),
    ])

    return {
      data,
      total: countResult.length,
    }
  }

  static async getById(id: string) {
    return db.query.relationships.findFirst({
      where: eq(relationships.id, id),
      with: {
        source: true,
        target: true,
      },
    })
  }

  static async create(input: CreateRelationshipInput) {
    // Check if relationship already exists
    const existing = await db.query.relationships.findFirst({
      where: and(eq(relationships.sourceId, input.sourceId), eq(relationships.targetId, input.targetId), eq(relationships.type, input.type as any)),
    })

    if (existing) {
      throw new Error('Relationship already exists')
    }

    // Verify both players exist
    const [source, target] = await Promise.all([
      db.query.players.findFirst({
        where: eq(players.id, input.sourceId),
      }),
      db.query.players.findFirst({
        where: eq(players.id, input.targetId),
      }),
    ])

    if (!source || !target) {
      throw new Error('One or both players not found')
    }

    await db.insert(relationships).values({
      ...input,
      type: input.type as any,
      direction: input.direction as any,
    })

    // Get the created relationship
    const created = await db.query.relationships.findFirst({
      where: and(eq(relationships.sourceId, input.sourceId), eq(relationships.targetId, input.targetId), eq(relationships.type, input.type as any)),
      with: {
        source: true,
        target: true,
      },
    })

    return created
  }

  static async update(id: string, input: UpdateRelationshipInput) {
    await db
      .update(relationships)
      .set({
        ...input,
        direction: input.direction as any,
        updatedAt: new Date(),
      })
      .where(eq(relationships.id, id))

    return this.getById(id)
  }

  static async delete(id: string) {
    await db.delete(relationships).where(eq(relationships.id, id))
  }
}
