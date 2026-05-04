import { Pool } from 'pg';
import * as schema from '../drizzle/schema';
export declare const db: import("drizzle-orm/node-postgres").NodePgDatabase<typeof schema> & {
    $client: Pool;
};
export type DB = typeof db;
//# sourceMappingURL=db.d.ts.map