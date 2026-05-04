import {
  pgTable,
  pgEnum,
  text,
  integer,
  real,
  boolean,
  timestamp,
  uniqueIndex,
  index,
  primaryKey,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createId } from '@paralleldrive/cuid2'

// ── Enums ────────────────────────────────────────────────
export const sectorEnum = pgEnum('sector', [
  'BANKING',
  'TELECOMMUNICATIONS',
  'ENERGY',
  'MANUFACTURING',
  'AGRICULTURE',
  'REAL_ESTATE',
  'GOVERNMENT',
  'REGULATION',
  'DIVERSIFIED',
  'INSURANCE',
  'FINTECH',
  'RETAIL',
  'MEDIA',
  'TRANSPORT',
])

export const entityTypeEnum = pgEnum('entity_type', [
  'LISTED_COMPANY',
  'SOE',
  'REGULATOR',
  'MINISTRY',
  'GOVERNMENT_AGENCY',
  'PRIVATE_COMPANY',
  'SUBSIDIARY',
  'INTERNATIONAL_ORG',
  'SACCO',
  'BANK',
])

export const relationshipTypeEnum = pgEnum('relationship_type', [
  'OWNERSHIP',
  'DEBT',
  'REGULATORY',
  'PARTNERSHIP',
  'SUPPLY_CHAIN',
  'BOARD_INTERLOCK',
  'COMPETITOR',
  'SUBSIDIARY_OF',
])

export const directionEnum = pgEnum('direction', ['UNIDIRECTIONAL', 'BIDIRECTIONAL'])
export const riskLevelEnum = pgEnum('risk_level', ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
export const impactLevelEnum = pgEnum('impact_level', ['LOW', 'MEDIUM', 'HIGH'])
export const impactTypeEnum = pgEnum('impact_type', ['POSITIVE', 'NEGATIVE', 'NEUTRAL'])
export const trendEnum = pgEnum('trend', ['UP', 'DOWN', 'STABLE'])
export const scraperStatusEnum = pgEnum('scraper_status', ['RUNNING', 'SUCCESS', 'FAILED', 'PARTIAL'])

// ── Players ──────────────────────────────────────────────
export const players = pgTable('players', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  sector: sectorEnum('sector').notNull(),
  type: entityTypeEnum('type').notNull(),
  subtype: text('subtype').notNull(),
  founded: integer('founded'),
  hq: text('hq'),
  ownership: text('ownership'),
  revenue: text('revenue'),
  employees: text('employees'),
  marketCap: text('market_cap'),
  description: text('description').notNull(),
  keyFacts: text('key_facts').array().notNull().default([]),
  tags: text('tags').array().notNull().default([]),
  riskLevel: riskLevelEnum('risk_level').notNull().default('MEDIUM'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// ── Relationships ─────────────────────────────────────────
export const relationships = pgTable(
  'relationships',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    sourceId: text('source_id')
      .notNull()
      .references(() => players.id),
    targetId: text('target_id')
      .notNull()
      .references(() => players.id),
    type: relationshipTypeEnum('type').notNull(),
    label: text('label').notNull(),
    weight: integer('weight').notNull().default(5),
    direction: directionEnum('direction').notNull().default('BIDIRECTIONAL'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (t) => ({
    uniqueRelationship: uniqueIndex('unique_relationship').on(t.sourceId, t.targetId, t.type),
  })
)

// ── Economic Events ───────────────────────────────────────
export const economicEvents = pgTable('economic_events', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  date: timestamp('date').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  impact: impactLevelEnum('impact').notNull(),
  impactType: impactTypeEnum('impact_type').notNull(),
  sectors: sectorEnum('sectors').array().notNull().default([]),
  tags: text('tags').array().notNull().default([]),
  source: text('source'),
  sourceUrl: text('source_url'),
  isAiExtracted: boolean('is_ai_extracted').notNull().default(false),
  rawContent: text('raw_content'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// ── Event ↔ Player join ───────────────────────────────────
export const eventPlayers = pgTable(
  'event_players',
  {
    eventId: text('event_id')
      .notNull()
      .references(() => economicEvents.id),
    playerId: text('player_id')
      .notNull()
      .references(() => players.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.eventId, t.playerId] }),
  })
)

// ── Macro Indicators ──────────────────────────────────────
export const macroIndicators = pgTable('macro_indicators', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  value: real('value').notNull(),
  unit: text('unit').notNull(),
  trend: trendEnum('trend').notNull(),
  changePercent: real('change_percent'),
  source: text('source').notNull(),
  asOf: timestamp('as_of').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// ── Indicator time series ─────────────────────────────────
export const indicatorDataPoints = pgTable(
  'indicator_data_points',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    indicatorId: text('indicator_id')
      .notNull()
      .references(() => macroIndicators.id),
    date: timestamp('date').notNull(),
    value: real('value').notNull(),
  },
  (t) => ({
    uniqueDataPoint: uniqueIndex('unique_data_point').on(t.indicatorId, t.date),
    dateIdx: index('indicator_date_idx').on(t.indicatorId, t.date),
  })
)

// ── Indicator ↔ Player join ───────────────────────────────
export const indicatorPlayers = pgTable(
  'indicator_players',
  {
    indicatorId: text('indicator_id')
      .notNull()
      .references(() => macroIndicators.id),
    playerId: text('player_id')
      .notNull()
      .references(() => players.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.indicatorId, t.playerId] }),
  })
)

// ── Player profile history ────────────────────────────────
export const playerProfileHistory = pgTable('player_profile_history', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  playerId: text('player_id')
    .notNull()
    .references(() => players.id),
  description: text('description').notNull(),
  keyFacts: text('key_facts').array().notNull().default([]),
  riskLevel: riskLevelEnum('risk_level').notNull(),
  changedAt: timestamp('changed_at').notNull().defaultNow(),
  changedBy: text('changed_by').notNull().default('system'),
})

// ── Query logs ────────────────────────────────────────────
export const queryLogs = pgTable('query_logs', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  query: text('query').notNull(),
  response: text('response').notNull(), // JSON stringified
  latencyMs: integer('latency_ms').notNull(),
  promptTokens: integer('prompt_tokens').notNull().default(0),
  outputTokens: integer('output_tokens').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ── Scraper runs ──────────────────────────────────────────
export const scraperRuns = pgTable('scraper_runs', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  scraperName: text('scraper_name').notNull(),
  status: scraperStatusEnum('status').notNull(),
  itemsFound: integer('items_found').notNull().default(0),
  itemsNew: integer('items_new').notNull().default(0),
  error: text('error'),
  startedAt: timestamp('started_at').notNull(),
  completedAt: timestamp('completed_at'),
})

// ── Drizzle relations (for query joins) ───────────────────
export const playersRelations = relations(players, ({ many }) => ({
  relationshipsFrom: many(relationships, { relationName: 'source' }),
  relationshipsTo: many(relationships, { relationName: 'target' }),
  eventPlayers: many(eventPlayers),
  indicatorPlayers: many(indicatorPlayers),
  profileHistory: many(playerProfileHistory),
}))

export const relationshipsRelations = relations(relationships, ({ one }) => ({
  source: one(players, {
    fields: [relationships.sourceId],
    references: [players.id],
    relationName: 'source',
  }),
  target: one(players, {
    fields: [relationships.targetId],
    references: [players.id],
    relationName: 'target',
  }),
}))

export const economicEventsRelations = relations(economicEvents, ({ many }) => ({
  eventPlayers: many(eventPlayers),
}))

export const eventPlayersRelations = relations(eventPlayers, ({ one }) => ({
  event: one(economicEvents, {
    fields: [eventPlayers.eventId],
    references: [economicEvents.id],
  }),
  player: one(players, {
    fields: [eventPlayers.playerId],
    references: [players.id],
  }),
}))

export const macroIndicatorsRelations = relations(macroIndicators, ({ many }) => ({
  timeSeries: many(indicatorDataPoints),
  indicatorPlayers: many(indicatorPlayers),
}))

export const indicatorDataPointsRelations = relations(indicatorDataPoints, ({ one }) => ({
  indicator: one(macroIndicators, {
    fields: [indicatorDataPoints.indicatorId],
    references: [macroIndicators.id],
  }),
}))
