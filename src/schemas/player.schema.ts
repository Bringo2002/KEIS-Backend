import { z } from 'zod'

export const CreatePlayerSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  sector: z.enum([
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
  ]),
  type: z.enum(['LISTED_COMPANY', 'SOE', 'REGULATOR', 'MINISTRY', 'PRIVATE_COMPANY', 'SUBSIDIARY', 'INTERNATIONAL_ORG', 'SACCO', 'BANK']),
  subtype: z.string().min(1).max(255),
  founded: z.number().int().positive().optional(),
  hq: z.string().max(255).optional(),
  ownership: z.string().max(255).optional(),
  revenue: z.string().max(255).optional(),
  employees: z.string().max(255).optional(),
  marketCap: z.string().max(255).optional(),
  description: z.string().min(1),
  keyFacts: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional().default('MEDIUM'),
})

export const UpdatePlayerSchema = z.object({
  name: z.string().min(1).max(255).optional(),
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
  type: z.enum(['LISTED_COMPANY', 'SOE', 'REGULATOR', 'MINISTRY', 'PRIVATE_COMPANY', 'SUBSIDIARY', 'INTERNATIONAL_ORG', 'SACCO', 'BANK']).optional(),
  subtype: z.string().min(1).max(255).optional(),
  founded: z.number().int().positive().optional(),
  hq: z.string().max(255).optional(),
  ownership: z.string().max(255).optional(),
  revenue: z.string().max(255).optional(),
  employees: z.string().max(255).optional(),
  marketCap: z.string().max(255).optional(),
  description: z.string().min(1).optional(),
  keyFacts: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
})

export const GetPlayersSchema = z.object({
  sector: z.enum([
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
  ]).optional(),
  type: z.enum(['LISTED_COMPANY', 'SOE', 'REGULATOR', 'MINISTRY', 'PRIVATE_COMPANY', 'SUBSIDIARY', 'INTERNATIONAL_ORG', 'SACCO', 'BANK']).optional(),
  tags: z.string().optional(), // comma-separated
  search: z.string().optional(),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(1000).default(20),
})

export type CreatePlayerInput = z.infer<typeof CreatePlayerSchema>
export type UpdatePlayerInput = z.infer<typeof UpdatePlayerSchema>
export type GetPlayersInput = z.infer<typeof GetPlayersSchema>
