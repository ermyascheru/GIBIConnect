import pg from 'pg';
const { Pool } = pg;

async function check() {
  const pool = new Pool({
    connectionString: 'postgresql://postgres:postgres@localhost:5432/gibiconnect',
  });

  const res = await pool.query(`
    SELECT p.name, tf.*
    FROM public.tuition_fees tf
    JOIN public.programs p ON tf.program_id = p.id
    JOIN public.institutions i ON tf.institution_id = i.id
    WHERE i.name ILIKE '%Addis Ababa%' AND p.name ILIKE '%Medicine%'
  `);

  console.log('Results:', res.rows);
  await pool.end();
}

check().catch(console.error);
