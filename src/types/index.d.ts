import { players, relationships, economicEvents, macroIndicators } from '../../drizzle/schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
export type Player = InferSelectModel<typeof players>;
export type CreatePlayerInput = InferInsertModel<typeof players>;
export type Relationship = InferSelectModel<typeof relationships>;
export type CreateRelationshipInput = InferInsertModel<typeof relationships>;
export type EconomicEvent = InferSelectModel<typeof economicEvents>;
export type CreateEventInput = InferInsertModel<typeof economicEvents>;
export type MacroIndicator = InferSelectModel<typeof macroIndicators>;
export type CreateIndicatorInput = InferInsertModel<typeof macroIndicators>;
export interface QueryResult {
    answer: string;
    sources: {
        playerId: string;
        playerName: string;
        relevance: number;
    }[];
    confidence: number;
    usage: {
        inputTokens: number;
        outputTokens: number;
    };
}
export interface ScraperResult {
    itemsFound: number;
    itemsNew: number;
    errors: string[];
}
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pages: number;
}
export interface ErrorResponse {
    error: string;
    message: string;
}
export interface ScraperJob {
    scraperName: string;
}
export type AIJobType = 'extract-event' | 'update-profile' | 'analyze-risk';
export interface AIJob {
    type: AIJobType;
    payload: Record<string, unknown>;
}
export interface ProfileUpdatePayload {
    playerId: string;
}
export interface RiskAnalysisPayload {
    playerId: string;
}
export interface EventExtractionPayload {
    text: string;
    url: string;
    date: Date;
}
export interface ExtractedEvent {
    title: string;
    description: string;
    impact: 'LOW' | 'MEDIUM' | 'HIGH';
    impactType: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    sectors: string[];
    playerIds: string[];
}
export interface RiskAnalysisResult {
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    reasoning: string;
}
export interface ProfileUpdateResult {
    description: string;
    keyFacts: string[];
}
//# sourceMappingURL=index.d.ts.map