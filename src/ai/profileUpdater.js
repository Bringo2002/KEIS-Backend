import { db } from '../db';
import { players, eventPlayers } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { client } from './client';
export class ProfileUpdater {
    static async updateProfile(playerId) {
        // Get player
        const player = await db.query.players.findFirst({
            where: eq(players.id, playerId),
        });
        if (!player)
            throw new Error('Player not found');
        // Get last 30 days events
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const playerEvents = await db.query.eventPlayers.findMany({
            where: eq(eventPlayers.playerId, playerId),
            with: {
                event: true,
            },
        });
        const recentEvents = playerEvents
            .filter((ep) => ep.event.date >= thirtyDaysAgo)
            .map((ep) => ep.event);
        // Call Claude to rewrite description
        const eventsText = recentEvents.map((e) => `- ${e.title}: ${e.description}`).join('\n');
        const response = await client.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 512,
            system: `You are an economic analyst. Update a company profile based on recent events.

Return a JSON object:
{
  "description": "updated 2-3 sentence description",
  "keyFacts": ["fact1", "fact2", "fact3"]
}`,
            messages: [
                {
                    role: 'user',
                    content: `Update profile for ${player.name} (${player.sector}).

Current description: ${player.description}

Recent events (last 30 days):
${eventsText || 'No recent events'}

Provide an updated description and 3 key facts.`,
                },
            ],
        });
        // Parse response
        let responseText = response.content[0].type === 'text' ? response.content[0].text : '';
        responseText = responseText.replace(/```json\n?|\n?```/g, '').trim();
        const parsed = JSON.parse(responseText);
        return {
            description: parsed.description,
            keyFacts: parsed.keyFacts,
        };
    }
}
//# sourceMappingURL=profileUpdater.js.map