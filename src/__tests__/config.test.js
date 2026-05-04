import { describe, it, expect } from 'vitest';
import { z } from 'zod';
describe('Config Validation', () => {
    it('should parse valid env vars', () => {
        const envSchema = z.object({
            NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
            PORT: z.coerce.number().default(3001),
            DATABASE_URL: z.string().url(),
            REDIS_URL: z.string().url(),
            ANTHROPIC_API_KEY: z.string().startsWith('sk-ant-'),
        });
        const validEnv = {
            NODE_ENV: 'development',
            PORT: '3001',
            DATABASE_URL: 'postgresql://localhost:5432/test',
            REDIS_URL: 'redis://localhost:6379',
            ANTHROPIC_API_KEY: 'sk-ant-test',
        };
        const result = envSchema.safeParse(validEnv);
        expect(result.success).toBe(true);
    });
    it('should reject invalid API key', () => {
        const envSchema = z.object({
            ANTHROPIC_API_KEY: z.string().startsWith('sk-ant-'),
        });
        const result = envSchema.safeParse({ ANTHROPIC_API_KEY: 'invalid-key' });
        expect(result.success).toBe(false);
    });
});
//# sourceMappingURL=config.test.js.map