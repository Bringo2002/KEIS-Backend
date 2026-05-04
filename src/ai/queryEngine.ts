import { db } from '../db'
import { players, economicEvents, macroIndicators, eventPlayers } from '../../drizzle/schema'
import { eq, desc, gte } from 'drizzle-orm'
import { client } from './client'
import { QueryResult } from '../types'

export class QueryEngine {
  static async query(userQuery: string): Promise<QueryResult> {
    // Load context from DB
    const [playersData, recentEvents, indicators] = await Promise.all([
      db.query.players.findMany({
        where: eq(players.isActive, true),
        limit: 50,
      }),
      db.query.economicEvents
        .findMany({
          limit: 30,
          orderBy: desc(economicEvents.date),
        })
        .then((events) => events.filter((e) => {
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
          return e.date >= thirtyDaysAgo
        })),
      db.query.macroIndicators.findMany({
        limit: 20,
      }),
    ])

    // Build compact context
    const context = this.buildContext(playersData, recentEvents, indicators)

    // Call Claude
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: `You are an AI analyst specializing in Kenya's economy. Provide accurate, data-driven insights.
      
Available context:
${context}

When referencing players or entities, use their IDs for clarity.`,
      messages: [
        {
          role: 'user',
          content: userQuery,
        },
      ],
    })

    // Extract text
    const answer =
      response.content[0].type === 'text' ? response.content[0].text : 'Unable to process query'

    // Extract relevant player IDs from answer (simple heuristic)
    const playerIds = playersData.map((p) => p.id).filter((id) => answer.includes(id))
    const sources = playersData
      .filter((p) => playerIds.includes(p.id))
      .map((p) => ({
        playerId: p.id,
        playerName: p.name,
        relevance: 0.8, // Simple relevance score
      }))

    return {
      answer,
      sources,
      confidence: 0.85,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    }
  }

  private static buildContext(
    playersData: any[],
    recentEvents: any[],
    indicators: any[]
  ): string {
    const playersText = playersData.map((p) => `- ${p.name} (${p.id}): ${p.sector}, ${p.keyFacts.slice(0, 2).join('; ')}`).join('\n')

    const eventsText = recentEvents.map((e) => `- [${e.date.toISOString().split('T')[0]}] ${e.title} (Impact: ${e.impact}, Type: ${e.impactType})`).join('\n')

    const indicatorsText = indicators.map((i) => `- ${i.name}: ${i.value} ${i.unit} (Trend: ${i.trend}, As of: ${i.asOf.toISOString().split('T')[0]})`).join('\n')

    return `
ACTIVE PLAYERS (50 most recent):
${playersText}

RECENT ECONOMIC EVENTS (last 30 days):
${eventsText}

KEY INDICATORS:
${indicatorsText}
`
  }
}
