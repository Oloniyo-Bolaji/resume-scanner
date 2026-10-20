import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let _sql: ReturnType<typeof neon> | null = null;
let _db: NeonHttpDatabase<typeof schema> | null = null;

export function getDb(): NeonHttpDatabase<typeof schema> {
  if (!_db) {
    if (!_sql) {
      _sql = neon(process.env.DATABASE_URL!);
    }
    _db = drizzle(_sql, { schema });
  }
  return _db;
}