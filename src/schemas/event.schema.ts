import { z } from 'zod'

export const CreateEventSchema = z.object({
  date: z.coerce.date(),
  title: z.string().min(1).max(500),
  description: z.string().min(1),
  impact: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  impactType: z.enum(['POSITIVE', 'NEGATIVE', 'NEUTRAL']),
  sectors: z
    .array(
      z.enum([
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
    )
    .optional()
    .default([]),
  tags: z.array(z.string()).optional().default([]),
  source: z.string().max(255).optional(),
  sourceUrl: z.string().url().optional(),
  playerId: z.string().optional(),
  playerIds: z.array(z.string()).optional().default([]),
  isAiExtracted: z.boolean().optional().default(false),
  rawContent: z.string().optional(),
})

export const UpdateEventSchema = z.object({
  date: z.coerce.date().optional(),
  title: z.string().min(1).max(500).optional(),
  description: z.string().min(1).optional(),
  impact: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  impactType: z.enum(['POSITIVE', 'NEGATIVE', 'NEUTRAL']).optional(),
  sectors: z
    .array(
      z.enum([
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
    )
    .optional(),
  tags: z.array(z.string()).optional(),
  source: z.string().max(255).optional(),
  sourceUrl: z.string().url().optional(),
})

export const GetEventsSchema = z.object({
  sector: z
    .enum([
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
    .optional(),
  impactType: z.enum(['POSITIVE', 'NEGATIVE', 'NEUTRAL']).optional(),
  impactLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  playerId: z.string().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(1000).default(20),
})

export type CreateEventInput = z.infer<typeof CreateEventSchema>
export type UpdateEventInput = z.infer<typeof UpdateEventSchema>
export type GetEventsInput = z.infer<typeof GetEventsSchema>
