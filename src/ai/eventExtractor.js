import { db } from '../db';
import { players } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { client } from './client';
export class EventExtractor {
    static async extract(text, url) {
        // Get player names for entity recognition
        const allPlayers = await db.query.players.findMany({
            where: eq(players.isActive, true),
        });
        const playerNames = allPlayers.map((p) => p.name);
        // Call Claude
        const response = await client.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 512,
            system: `You are an economic event extractor. Analyze articles and extract economically significant events in Kenya.

If the article is NOT economically significant for Kenya, return: { "event": null }

Otherwise, extract and return a JSON object:
{
  "event": {
    "title": "string (max 500 chars)",
    "description": "string",
    "impact": "LOW|MEDIUM|HIGH",
    "impactType": "POSITIVE|NEGATIVE|NEUTRAL",
    "sectors": ["array of sectors from: BANKING, TELECOMMUNICATIONS, ENERGY, MANUFACTURING, AGRICULTURE, REAL_ESTATE, GOVERNMENT, REGULATION, DIVERSIFIED, INSURANCE, FINTECH, RETAIL, MEDIA, TRANSPORT"],
    "playerNames": ["array of mentioned player names from provided list"]
  }
}

PLAYER NAMES TO RECOGNIZE:
${playerNames.join(', ')}
`,
            messages: [
                {
                    role: 'user',
                    content: `Article from ${url}:\n\n${text.substring(0, 2000)}`,
                },
            ],
        });
        // Parse response
        let responseText = response.content[0].type === 'text' ? response.content[0].text : '';
        // Clean up response
        responseText = responseText.replace(/```json\n?|\n?```/g, '').trim();
        try {
            const parsed = JSON.parse(responseText);
            if (!parsed.event || parsed.event === null) {
                return null;
            }
            // Map player names to IDs
            const playerIds = allPlayers
                .filter((p) => parsed.event.playerNames && parsed.event.playerNames.includes(p.name))
                .map((p) => p.id);
            return {
                title: parsed.event.title,
                description: parsed.event.description,
                impact: parsed.event.impact,
                impactType: parsed.event.impactType,
                sectors: parsed.event.sectors,
                playerIds,
            };
        }
        catch (_err) {
            return null;
        }
    }
}
//# sourceMappingURL=eventExtractor.js.map