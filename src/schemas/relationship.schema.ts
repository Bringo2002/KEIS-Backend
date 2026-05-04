import { z } from 'zod'

export const CreateRelationshipSchema = z.object({
  sourceId: z.string(),
  targetId: z.string(),
  type: z.enum(['OWNERSHIP', 'DEBT', 'REGULATORY', 'PARTNERSHIP', 'SUPPLY_CHAIN', 'BOARD_INTERLOCK', 'COMPETITOR', 'SUBSIDIARY_OF']),
  label: z.string().min(1).max(255),
  weight: z.number().int().min(1).max(10).optional().default(5),
  direction: z.enum(['UNIDIRECTIONAL', 'BIDIRECTIONAL']).optional().default('BIDIRECTIONAL'),
})

export const UpdateRelationshipSchema = z.object({
  label: z.string().min(1).max(255).optional(),
  weight: z.number().int().min(1).max(10).optional(),
  direction: z.enum(['UNIDIRECTIONAL', 'BIDIRECTIONAL']).optional(),
})

export const GetRelationshipsSchema = z.object({
  playerId: z.string().optional(),
  type: z.enum(['OWNERSHIP', 'DEBT', 'REGULATORY', 'PARTNERSHIP', 'SUPPLY_CHAIN', 'BOARD_INTERLOCK', 'COMPETITOR', 'SUBSIDIARY_OF']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(1000).default(20),
})

export type CreateRelationshipInput = z.infer<typeof CreateRelationshipSchema>
export type UpdateRelationshipInput = z.infer<typeof UpdateRelationshipSchema>
export type GetRelationshipsInput = z.infer<typeof GetRelationshipsSchema>
