import { db } from '../db'
import { macroIndicators, indicatorDataPoints, indicatorPlayers } from '../../drizzle/schema'
import { eq, desc, asc, count, and } from 'drizzle-orm'
import { CreateIndicatorInput, UpdateIndicatorInput, DataPointInput } from '../schemas/indicator.schema'

export class IndicatorService {
  static async getAll(limit: number = 20, offset: number = 0) {
    const indicators = await db.query.macroIndicators.findMany({
      with: {
        timeSeries: {
          limit: 30,
          orderBy: desc(indicatorDataPoints.date),
        },
      },
      orderBy: asc(macroIndicators.name),
      limit,
      offset,
    })

    const totalRows = await db.select({ total: count() }).from(macroIndicators)

    return {
      data: indicators,
      total: Number(totalRows[0]?.total ?? 0),
    }
  }

  static async getBySlug(slug: string) {
    return db.query.macroIndicators.findFirst({
      where: eq(macroIndicators.slug, slug),
      with: {
        timeSeries: {
          orderBy: asc(indicatorDataPoints.date),
        },
      },
    })
  }

  static async create(input: CreateIndicatorInput) {
    // Check if slug already exists
    const existing = await db.query.macroIndicators.findFirst({
      where: eq(macroIndicators.slug, input.slug),
    })

    if (existing) {
      throw new Error('Indicator with this slug already exists')
    }

    const result = await db.transaction(async (tx) => {
      await tx.insert(macroIndicators).values({
        ...input,
        trend: input.trend as any,
      })

      // Add initial data point
      const indicator = await tx.query.macroIndicators.findFirst({
        where: eq(macroIndicators.slug, input.slug),
      })

      if (!indicator) throw new Error('Failed to create indicator')

      await tx.insert(indicatorDataPoints).values({
        indicatorId: indicator.id,
        date: input.asOf,
        value: input.value,
      })

      return indicator.id
    })

    return this.getBySlug(input.slug)
  }

  static async update(slug: string, input: UpdateIndicatorInput) {
    await db.update(macroIndicators).set({ ...input, updatedAt: new Date() }).where(eq(macroIndicators.slug, slug))

    return this.getBySlug(slug)
  }

  static async upsertDataPoint(slug: string, date: Date, value: number) {
    return db.transaction(async (tx) => {
      // Get indicator by slug
      const indicator = await tx.query.macroIndicators.findFirst({
        where: eq(macroIndicators.slug, slug),
      })

      if (!indicator) throw new Error('Indicator not found')

      // Upsert data point
      await tx
        .insert(indicatorDataPoints)
        .values({ indicatorId: indicator.id, date, value })
        .onConflictDoUpdate({
          target: [indicatorDataPoints.indicatorId, indicatorDataPoints.date],
          set: { value },
        })

      // Recalculate trend from last 2 data points
      const recent = await tx.query.indicatorDataPoints.findMany({
        where: eq(indicatorDataPoints.indicatorId, indicator.id),
        orderBy: desc(indicatorDataPoints.date),
        limit: 2,
      })

      if (recent.length >= 2) {
        const trend = recent[0].value > recent[1].value ? 'UP' : recent[0].value < recent[1].value ? 'DOWN' : 'STABLE'
        const changePercent = ((recent[0].value - recent[1].value) / recent[1].value) * 100

        await tx
          .update(macroIndicators)
          .set({
            value: recent[0].value,
            trend: trend as any,
            changePercent,
            asOf: recent[0].date,
            updatedAt: new Date(),
          })
          .where(eq(macroIndicators.id, indicator.id))
      }
    })
  }

  static async addPlayer(slug: string, playerId: string) {
    const indicator = await db.query.macroIndicators.findFirst({
      where: eq(macroIndicators.slug, slug),
    })

    if (!indicator) throw new Error('Indicator not found')

    await db
      .insert(indicatorPlayers)
      .values({ indicatorId: indicator.id, playerId })
      .onConflictDoNothing()
  }

  static async removePlayer(slug: string, playerId: string) {
    const indicator = await db.query.macroIndicators.findFirst({
      where: eq(macroIndicators.slug, slug),
    })

    if (!indicator) throw new Error('Indicator not found')

    await db
      .delete(indicatorPlayers)
      .where(and(eq(indicatorPlayers.indicatorId, indicator.id), eq(indicatorPlayers.playerId, playerId)))
  }
}
