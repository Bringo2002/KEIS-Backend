import 'dotenv/config';
import { z } from 'zod';
declare const envSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
    PORT: z.ZodDefault<z.ZodNumber>;
    DATABASE_URL: z.ZodString;
    REDIS_URL: z.ZodString;
    ANTHROPIC_API_KEY: z.ZodString;
    FRONTEND_URL: z.ZodDefault<z.ZodString>;
    LOG_LEVEL: z.ZodDefault<z.ZodEnum<["debug", "info", "warn", "error"]>>;
}, "strip", z.ZodTypeAny, {
    NODE_ENV: "development" | "production" | "test";
    PORT: number;
    DATABASE_URL: string;
    REDIS_URL: string;
    ANTHROPIC_API_KEY: string;
    FRONTEND_URL: string;
    LOG_LEVEL: "debug" | "info" | "warn" | "error";
}, {
    DATABASE_URL: string;
    REDIS_URL: string;
    ANTHROPIC_API_KEY: string;
    NODE_ENV?: "development" | "production" | "test" | undefined;
    PORT?: number | undefined;
    FRONTEND_URL?: string | undefined;
    LOG_LEVEL?: "debug" | "info" | "warn" | "error" | undefined;
}>;
export declare const config: {
    NODE_ENV: "development" | "production" | "test";
    PORT: number;
    DATABASE_URL: string;
    REDIS_URL: string;
    ANTHROPIC_API_KEY: string;
    FRONTEND_URL: string;
    LOG_LEVEL: "debug" | "info" | "warn" | "error";
};
export type Config = z.infer<typeof envSchema>;
export {};
//# sourceMappingURL=config.d.ts.map