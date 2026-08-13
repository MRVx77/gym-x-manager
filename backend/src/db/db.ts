import { Pool, QueryResult, QueryResultRow } from "pg";
import { env } from "../config/env";
import { logger } from "../lib/logger";

export const pool = new Pool({
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  ssl: env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});

export async function query<T extends QueryResultRow>(
  text: string,
  params: unknown[],
): Promise<QueryResult<T>> {
  const res = await pool.query<T>(text, params as any[]);
  return res;
}

export async function ConnectToDB() {
  try {
    await pool.query("SELECT 1");
    logger.info("Connected to DB");
  } catch (error) {
    throw error;
  }
}
