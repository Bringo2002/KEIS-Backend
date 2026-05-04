import { defineConfig } from 'drizzle-kit'
import { config } from './src/config'

export default defineConfig({
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  // Cast to any to satisfy differing dbCredentials typings while providing a connection URL
  dbCredentials: { url: config.DATABASE_URL } as any,
  verbose: true,
  strict: true,
} as any)
