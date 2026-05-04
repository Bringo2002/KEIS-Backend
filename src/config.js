import 'dotenv/config';
import { z } from 'zod';
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(3002),
    DATABASE_URL: z.string().url(),
    REDIS_URL: z.string().url(),
    ANTHROPIC_API_KEY: z.string().startsWith('sk-ant-'),
    FRONTEND_URL: z.string().url().default('http://localhost:5173'),
    LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});
export const config = envSchema.parse(process.env);
//# sourceMappingURL=config.js.map