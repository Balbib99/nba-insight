import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

const isProduction = process.env.NODE_ENV === 'production';
const shouldUseSsl = isProduction || process.env.DATABASE_SSL === 'true';
const connectionString =
  process.env.DATABASE_URL ?? (isProduction ? undefined : 'postgresql://postgres:postgres@localhost:5432/nba_insight');

if (!connectionString) {
  throw new Error('DATABASE_URL is required in production');
}

export const pool = new Pool({
  connectionString,
  ssl: shouldUseSsl ? { rejectUnauthorized: false } : undefined,
});
