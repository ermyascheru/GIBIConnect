const { Pool } = require('pg');
const env = require('./env');

const dbHost = process.env.DB_HOST || env.DB_HOST || 'db';
const dbPort = process.env.DB_PORT || env.DB_PORT || 5432;
const dbUser = process.env.DB_USER || env.DB_USER || 'postgres';
const dbPass = process.env.DB_PASSWORD || env.DB_PASSWORD || 'postgres';
const dbName = process.env.DB_NAME || env.DB_NAME || 'gibiconnect_db';

// If DB_HOST is explicitly provided (e.g. 'db' in docker container) or DATABASE_URL not set, construct DB URL with dbHost
let connectionString = process.env.DATABASE_URL;
if (!connectionString || process.env.DB_HOST) {
  connectionString = `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`;
}

const pool = new Pool({
  connectionString,
  host: dbHost,
  port: parseInt(dbPort, 10),
  user: dbUser,
  password: dbPass,
  database: dbName,
  max: parseInt(process.env.PGPOOL_MAX || '20', 10),
  idleTimeoutMillis: parseInt(process.env.PG_IDLE_TIMEOUT || '30000', 10),
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
