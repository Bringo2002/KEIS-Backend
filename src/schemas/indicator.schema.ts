import { z } from 'zod'

export const CreateIndicatorSchema = z.object({
  slug: z.string().min(1).max(255),
  name: z.string().min(1).max(255),
  value: z.number(),
  unit: z.string().min(1).max(50),
  trend: z.enum(['UP', 'DOWN', 'STABLE']),
  source: z.string().min(1).max(255),
  asOf: z.coerce.date(),
  changePercent: z.number().optional(),
})

export const UpdateIndicatorSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  value: z.number().optional(),
  unit: z.string().min(1).max(50).optional(),
  trend: z.enum(['UP', 'DOWN', 'STABLE']).optional(),
  source: z.string().min(1).max(255).optional(),
  asOf: z.coerce.date().optional(),
  changePercent: z.number().optional(),
})

export const DataPointSchema = z.object({
  date: z.coerce.date(),
  value: z.number(),
})

export const GetIndicatorsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

export type CreateIndicatorInput = z.infer<typeof CreateIndicatorSchema>
export type UpdateIndicatorInput = z.infer<typeof UpdateIndicatorSchema>
export type DataPointInput = z.infer<typeof DataPointSchema>
export type GetIndicatorsInput = z.infer<typeof GetIndicatorsSchema>
