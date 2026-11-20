import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

let pool = null;

function isLocalConnection(connectionString) {
  return /localhost|127\.0\.0\.1/i.test(connectionString);
}

export function getPool() {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) {
    const err = new Error(
      "DATABASE_URL belum diisi di server/.env. Isi connection string PostgreSQL (Neon / Supabase Postgres) terlebih dahulu."
    );
    err.status = 503;
    throw err;
  }

  pool = new Pool({
    connectionString,
    max: process.env.VERCEL ? 5 : 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    // Cloud Postgres (Neon, Supabase, Railway) requires TLS
    ssl: isLocalConnection(connectionString) ? false : { rejectUnauthorized: false },
  });

  pool.on("error", (err) => {
    console.error("[pg pool error]", err.message);
  });

  return pool;
}

export function query(text, params) {
  return getPool().query(text, params);
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
