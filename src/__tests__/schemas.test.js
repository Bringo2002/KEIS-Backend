import { describe, it, expect } from 'vitest';
import { CreatePlayerSchema, GetPlayersSchema } from '../schemas/player.schema';
describe('Player Schema Validation', () => {
    it('should validate valid player creation input', () => {
        const input = {
            name: 'Test Company',
            slug: 'test-company',
            sector: 'BANKING',
            type: 'LISTED_COMPANY',
            subtype: 'Commercial Bank',
            description: 'A test company',
        };
        const result = CreatePlayerSchema.safeParse(input);
        expect(result.success).toBe(true);
    });
    it('should reject missing required fields', () => {
        const input = {
            name: 'Test Company',
            sector: 'BANKING',
            type: 'LISTED_COMPANY',
        };
        const result = CreatePlayerSchema.safeParse(input);
        expect(result.success).toBe(false);
    });
    it('should validate pagination params', () => {
        const params = {
            page: 1,
            limit: 20,
            sector: 'BANKING',
        };
        const result = GetPlayersSchema.safeParse(params);
        expect(result.success).toBe(true);
    });
    it('should reject invalid limit', () => {
        const params = {
            page: 1,
            limit: 500, // max is 100
        };
        const result = GetPlayersSchema.safeParse(params);
        expect(result.success).toBe(false);
    });
});
//# sourceMappingURL=schemas.test.js.map