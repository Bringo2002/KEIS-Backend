import { db } from '../db';
import { economicEvents, eventPlayers } from '../../drizzle/schema';
import { eq, and, desc, gte, lte } from 'drizzle-orm';
export class EventService {
    static async getAll(sector, impactType, impactLevel, playerId, from, to, limit = 20, offset = 0) {
        const conditions = [
            sector ? eq(economicEvents.sectors, [sector]) : undefined,
            impactType ? eq(economicEvents.impactType, impactType) : undefined,
            impactLevel ? eq(economicEvents.impact, impactLevel) : undefined,
            from ? gte(economicEvents.date, from) : undefined,
            to ? lte(economicEvents.date, to) : undefined,
        ].filter(Boolean);
        let query = db.query.economicEvents.findMany({
            where: conditions.length > 0 ? and(...conditions) : undefined,
            with: {
                eventPlayers: {
                    with: { player: true },
                },
            },
            orderBy: desc(economicEvents.date),
            limit,
            offset,
        });
        // Filter by playerId if provided
        let data = await query;
        if (playerId) {
            data = data.filter((e) => e.eventPlayers.some((ep) => ep.playerId === playerId));
        }
        const countResult = await db
            .select({ count: economicEvents.id })
            .from(economicEvents)
            .where(conditions.length > 0 ? and(...conditions) : undefined);
        return {
            data,
            total: countResult.length,
        };
    }
    static async getById(id) {
        return db.query.economicEvents.findFirst({
            where: eq(economicEvents.id, id),
            with: {
                eventPlayers: {
                    with: { player: true },
                },
            },
        });
    }
    static async create(input) {
        const { playerIds = [], ...eventData } = input;
        const event = await db.transaction(async (tx) => {
            const result = await tx.insert(economicEvents).values({
                ...eventData,
                sectors: eventData.sectors,
                impactType: eventData.impactType,
                impact: eventData.impact,
            });
            const eventId = result.rows?.[0]?.id;
            // Get inserted event to find ID
            const inserted = await tx.query.economicEvents.findFirst({
                where: eq(economicEvents.date, eventData.date),
                orderBy: desc(economicEvents.createdAt),
            });
            if (!inserted)
                throw new Error('Failed to create event');
            // Add player associations
            if (playerIds.length > 0) {
                await tx.insert(eventPlayers).values(playerIds.map((pid) => ({
                    eventId: inserted.id,
                    playerId: pid,
                })));
            }
            return inserted.id;
        });
        return this.getById(event);
    }
    static async update(id, input) {
        await db.update(economicEvents).set({ ...input, updatedAt: new Date() }).where(eq(economicEvents.id, id));
        return this.getById(id);
    }
    static async delete(id) {
        await db.delete(eventPlayers).where(eq(eventPlayers.eventId, id));
        await db.delete(economicEvents).where(eq(economicEvents.id, id));
    }
    static async addPlayer(eventId, playerId) {
        await db.insert(eventPlayers).values({ eventId, playerId }).onConflictDoNothing();
    }
    static async removePlayer(eventId, playerId) {
        await db.delete(eventPlayers).where(and(eq(eventPlayers.eventId, eventId), eq(eventPlayers.playerId, playerId)));
    }
}
//# sourceMappingURL=event.service.js.map