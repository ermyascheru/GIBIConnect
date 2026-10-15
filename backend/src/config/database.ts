import { Pool } from "pg";
import { env } from "./env";

const pool = new Pool({
  connectionString: env.databaseUrl,
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