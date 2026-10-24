const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const env = require('./env');

const dbHost = process.env.DB_HOST || env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || env.DB_PORT || 5432;
const dbUser = process.env.DB_USER || env.DB_USER || 'postgres';
const dbPass = process.env.DB_PASSWORD || env.DB_PASSWORD || 'postgres';
const dbName = process.env.DB_NAME || env.DB_NAME || 'gibiconnect';

let connectionString = process.env.DATABASE_URL;
if (!connectionString) {
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

const adminDashboardSchemaSQL = `
  CREATE TABLE IF NOT EXISTS admin_files (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    size BIGINT,
    file_path VARCHAR(500) NOT NULL,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin_activity (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin_backups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP,
    file_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_admin_files_uploaded_by ON admin_files(uploaded_by);
  CREATE INDEX IF NOT EXISTS idx_admin_files_uploaded_at ON admin_files(uploaded_at);
  CREATE INDEX IF NOT EXISTS idx_admin_activity_user_id ON admin_activity(user_id);
  CREATE INDEX IF NOT EXISTS idx_admin_activity_timestamp ON admin_activity(timestamp);
  CREATE INDEX IF NOT EXISTS idx_admin_settings_key ON admin_settings(key);

  INSERT INTO admin_settings (key, value)
  VALUES ('appName', 'GIBIConnect'), ('environment', 'development'), ('enableMFA', 'false'), ('enableAudit', 'true')
  ON CONFLICT (key) DO NOTHING;
`;

async function ensureAdminDashboardTables() {
  try {
    await pool.query(adminDashboardSchemaSQL);

    const adminExists = await pool.query(
      'SELECT 1 FROM users WHERE email = $1 LIMIT 1',
      ['admin@gibiconnect.edu.et']
    );

    if (adminExists.rowCount === 0) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      await pool.query(`
        INSERT INTO users (id, email, password_hash, full_name, role, status)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (email) DO NOTHING
      `, [
        '90000000-0000-4000-8000-000000000001',
        'admin@gibiconnect.edu.et',
        passwordHash,
        'Dr. Ermias Girma',
        'admin',
        'active'
      ]);
    } else {
      const existingAdmin = adminExists.rows[0];
      const needsRepair = !existingAdmin.password_hash || existingAdmin.password_hash.includes('demoHashForAdmin') || existingAdmin.role !== 'admin' || existingAdmin.status !== 'active';

      if (needsRepair) {
        const passwordHash = await bcrypt.hash('admin123', 10);
        await pool.query(`
          UPDATE users
          SET password_hash = $1,
              full_name = COALESCE(full_name, 'Dr. Ermias Girma'),
              role = 'admin',
              status = 'active'
          WHERE email = $2
        `, [passwordHash, 'admin@gibiconnect.edu.et']);
      }
    }

    return true;
  } catch (error) {
    console.error('Failed to ensure admin dashboard tables exist:', error.message);
    return false;
  }
}

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  ensureAdminDashboardTables
};
