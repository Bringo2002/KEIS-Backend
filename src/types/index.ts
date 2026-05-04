import { players, relationships, economicEvents, macroIndicators } from '../../drizzle/schema'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'

// Players
export type Player = InferSelectModel<typeof players>
export type CreatePlayerInput = InferInsertModel<typeof players>

// Relationships
export type Relationship = InferSelectModel<typeof relationships>
export type CreateRelationshipInput = InferInsertModel<typeof relationships>

// Economic Events
export type EconomicEvent = InferSelectModel<typeof economicEvents>
export type CreateEventInput = InferInsertModel<typeof economicEvents>

// Macro Indicators
export type MacroIndicator = InferSelectModel<typeof macroIndicators>
export type CreateIndicatorInput = InferInsertModel<typeof macroIndicators>

// Query results
export interface QueryResult {
  answer: string
  sources: {
    playerId: string
    playerName: string
    relevance: number
  }[]
  confidence: number
  usage: {
    inputTokens: number
    outputTokens: number
  }
}

// Scraper
export interface ScraperResult {
  itemsFound: number
  itemsNew: number
  errors: string[]
}

// API Responses
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pages: number
}

export interface ErrorResponse {
  error: string
  message: string
}

// BullMQ Jobs
export interface ScraperJob {
  scraperName: string
}

export type AIJobType = 'extract-event' | 'update-profile' | 'analyze-risk'

export interface AIJob {
  type: AIJobType
  payload: Record<string, unknown>
}

// Profile update
export interface ProfileUpdatePayload {
  playerId: string
}

// Risk analysis
export interface RiskAnalysisPayload {
  playerId: string
}

// Event extraction
export interface EventExtractionPayload {
  text: string
  url: string
  date: Date
}

// AI results
export interface ExtractedEvent {
  title: string
  description: string
  impact: 'LOW' | 'MEDIUM' | 'HIGH'
  impactType: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'
  sectors: string[]
  playerIds: string[]
}

export interface RiskAnalysisResult {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  reasoning: string
}

export interface ProfileUpdateResult {
  description: string
  keyFacts: string[]
}
