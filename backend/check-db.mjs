import pg from 'pg';
const { Pool } = pg;

async function checkDb() {
  const pool = new Pool({
    connectionString: 'postgresql://postgres:postgres@localhost:5432/gibiconnect'
  });

  try {
    const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log(`Tables found in 'gibiconnect' database: ${res.rows.length}`);
    for (const r of res.rows) {
      const countRes = await pool.query(`SELECT count(*) FROM "${r.table_name}"`);
      console.log(`  - ${r.table_name}: ${countRes.rows[0].count} rows`);
    }
  } catch (err) {
    console.error('Error connecting to database:', err.message);
  } finally {
    await pool.end();
  }
}

checkDb();
