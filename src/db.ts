import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schemaModule from '../drizzle/schema'
import { config } from './config'

const pool = new Pool({ connectionString: config.DATABASE_URL })

// Normalize schema exports to a plain object for Drizzle runtime introspection.
const schema = schemaModule
const runtimeSchema = { ...schemaModule } as typeof schemaModule
delete (runtimeSchema as Record<string, unknown>).default

export const db = drizzle<typeof schema>(pool, {
  schema: runtimeSchema,
  logger: config.NODE_ENV === 'development',
})
export type DB = typeof db
