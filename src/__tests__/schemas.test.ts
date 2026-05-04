import { describe, it, expect, beforeAll } from 'vitest'
import { CreatePlayerSchema, GetPlayersSchema } from '../schemas/player.schema'

describe('Player Schema Validation', () => {
  it('should validate valid player creation input', () => {
    const input = {
      name: 'Test Company',
      slug: 'test-company',
      sector: 'BANKING' as const,
      type: 'LISTED_COMPANY' as const,
      subtype: 'Commercial Bank',
      description: 'A test company',
    }

    const result = CreatePlayerSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it('should reject missing required fields', () => {
    const input = {
      name: 'Test Company',
      sector: 'BANKING' as const,
      type: 'LISTED_COMPANY' as const,
    }

    const result = CreatePlayerSchema.safeParse(input)
    expect(result.success).toBe(false)
  })

  it('should validate pagination params', () => {
    const params = {
      page: 1,
      limit: 20,
      sector: 'BANKING' as const,
    }

    const result = GetPlayersSchema.safeParse(params)
    expect(result.success).toBe(true)
  })

  it('should reject invalid limit', () => {
    const params = {
      page: 1,
      limit: 500, // max is 100
    }

    const result = GetPlayersSchema.safeParse(params)
    expect(result.success).toBe(false)
  })
})
