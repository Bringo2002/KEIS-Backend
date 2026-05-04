import { db } from '../db'
import { players, eventPlayers, economicEvents } from '../../drizzle/schema'
import { eq, gte } from 'drizzle-orm'
import { client } from './client'
import { RiskAnalysisResult } from '../types'

export class RiskAnalyzer {
  static async analyzeRisk(playerId: string): Promise<RiskAnalysisResult> {
    // Get player
    const player = await db.query.players.findFirst({
      where: eq(players.id, playerId),
    })

    if (!player) throw new Error('Player not found')

    // Get last 30 days events
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const playerEvents = await db.query.eventPlayers.findMany({
      where: eq(eventPlayers.playerId, playerId),
      with: {
        event: true,
      },
    })

    const recentEvents = playerEvents.filter((ep) => ep.event.date >= thirtyDaysAgo).map((ep) => ep.event)

    // Count negative/high-impact events
    const negativeCount = recentEvents.filter((e) => e.impactType === 'NEGATIVE' || e.impact === 'HIGH').length

    // Call Claude to analyze risk
    const eventsText = recentEvents
      .map((e) => `- ${e.title} (Impact: ${e.impact}, Type: ${e.impactType})`)
      .join('\n')

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      system: `You are a risk analyst for Kenya's economy. Assess company risk based on recent events.

Return a JSON object:
{
  "riskLevel": "LOW|MEDIUM|HIGH|CRITICAL",
  "reasoning": "brief explanation"
}`,
      messages: [
        {
          role: 'user',
          content: `Analyze risk for ${player.name} (${player.sector}).
Current risk level: ${player.riskLevel}

Recent events (last 30 days, ${negativeCount} negative):
${eventsText || 'No recent events'}

Assess updated risk level.`,
        },
      ],
    })

    // Parse response
    let responseText = response.content[0].type === 'text' ? response.content[0].text : ''
    responseText = responseText.replace(/```json\n?|\n?```/g, '').trim()

    const parsed = JSON.parse(responseText)

    return {
      riskLevel: parsed.riskLevel,
      reasoning: parsed.reasoning,
    }
  }
}
