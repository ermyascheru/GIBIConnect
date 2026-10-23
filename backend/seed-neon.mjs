import fs from 'fs';
import path from 'path';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;
const databaseUrl = process.argv[2] || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ Error: No DATABASE_URL provided.');
  console.log('Usage: node seed-neon.mjs "postgresql://user:pass@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require"');
  process.exit(1);
}

console.log('🔄 Connecting to Neon / PostgreSQL database...');

const client = new Client({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function run() {
  try {
    await client.connect();
    console.log('✅ Connected successfully to remote database!');

    const dumpPath = path.resolve('prisma', 'neon-dump.sql');
    if (!fs.existsSync(dumpPath)) {
      console.error(`❌ Dump file not found at: ${dumpPath}`);
      process.exit(1);
    }

    console.log(`📖 Reading SQL dump from ${dumpPath}...`);
    const sql = fs.readFileSync(dumpPath, 'utf8');

    console.log('⏳ Executing schema and data migration on Neon (this takes ~5-15 seconds)...');
    await client.query(sql);

    console.log('✨ Neon database seeded successfully with all tables, institutions, programs, and records!');
  } catch (err) {
    console.error('❌ Error seeding Neon database:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
