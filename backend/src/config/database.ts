import { Pool } from "pg";
import { env } from "./env";

const isSsl =
  env.nodeEnv === "production" ||
  env.databaseUrl.includes("neon.tech") ||
  env.databaseUrl.includes("sslmode=require");

const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: isSsl ? { rejectUnauthorized: false } : undefined,
});

export const checkDatabaseConnection = async (): Promise<void> => {
  const client = await pool.connect();

  try {
    await client.query("SELECT 1");
  } finally {
    client.release();
  }
};

export default pool;
