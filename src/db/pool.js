import pg from 'pg';
import { config } from '../config/index.js';

if (!config.databaseUrl) {
  console.error('[db] DATABASE_URL is not set. Copy .env.example to .env and configure it.');
}

// Postgres returns int8 (bigint) as a string by default; our ids/counts fit in
// a JS number safely, so parse them to numbers for cleaner templates.
pg.types.setTypeParser(20, (val) => (val === null ? null : parseInt(val, 10)));

export const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  ssl: config.pgSsl ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => {
  console.error('[db] Unexpected error on idle client', err);
});

export const query = (text, params) => pool.query(text, params);

export async function withClient(fn) {
  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}
