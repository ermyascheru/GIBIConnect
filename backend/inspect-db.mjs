import pg from 'pg';
const { Pool } = pg;

async function check() {
  const pool = new Pool({
    connectionString: 'postgresql://postgres:postgres@localhost:5432/gibiconnect',
  });

  const res = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'rag_document_chunks'");
  console.log('rag_document_chunks columns:', res.rows);

  const sample = await pool.query("SELECT id, document_id, section_title, page_number FROM public.rag_document_chunks LIMIT 3");
  console.log('Sample chunks:', sample.rows);

  await pool.end();
}

check().catch(console.error);
