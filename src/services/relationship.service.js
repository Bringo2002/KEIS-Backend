import { db } from '../db';
import { relationships, players } from '../../drizzle/schema';
import { eq, or, and, asc } from 'drizzle-orm';
export class RelationshipService {
    static async getAll(playerId, type, limit = 20, offset = 0) {
        const conditions = [
            playerId ? or(eq(relationships.sourceId, playerId), eq(relationships.targetId, playerId)) : undefined,
            type ? eq(relationships.type, type) : undefined,
        ].filter(Boolean);
        const [data, countResult] = await Promise.all([
            db.query.relationships.findMany({
                where: conditions.length > 0 ? and(...conditions) : undefined,
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
                .where(conditions.length > 0 ? and(...conditions) : undefined),
        ]);
        return {
            data,
            total: countResult.length,
        };
    }
    static async getById(id) {
        return db.query.relationships.findFirst({
            where: eq(relationships.id, id),
            with: {
                source: true,
                target: true,
            },
        });
    }
    static async create(input) {
        // Check if relationship already exists
        const existing = await db.query.relationships.findFirst({
            where: and(eq(relationships.sourceId, input.sourceId), eq(relationships.targetId, input.targetId), eq(relationships.type, input.type)),
        });
        if (existing) {
            throw new Error('Relationship already exists');
        }
        // Verify both players exist
        const [source, target] = await Promise.all([
            db.query.players.findFirst({
                where: eq(players.id, input.sourceId),
            }),
            db.query.players.findFirst({
                where: eq(players.id, input.targetId),
            }),
        ]);
        if (!source || !target) {
            throw new Error('One or both players not found');
        }
        await db.insert(relationships).values({
            ...input,
            type: input.type,
            direction: input.direction,
        });
        // Get the created relationship
        const created = await db.query.relationships.findFirst({
            where: and(eq(relationships.sourceId, input.sourceId), eq(relationships.targetId, input.targetId), eq(relationships.type, input.type)),
            with: {
                source: true,
                target: true,
            },
        });
        return created;
    }
    static async update(id, input) {
        await db
            .update(relationships)
            .set({
            ...input,
            direction: input.direction,
            updatedAt: new Date(),
        })
            .where(eq(relationships.id, id));
        return this.getById(id);
    }
    static async delete(id) {
        await db.delete(relationships).where(eq(relationships.id, id));
    }
}
//# sourceMappingURL=relationship.service.js.map