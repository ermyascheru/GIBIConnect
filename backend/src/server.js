require('dotenv').config();
const app = require('./app');
const { pool } = require('./config/database');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, async () => {
  console.log(`🚀 GIBIConnect Backend API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  try {
    const res = await pool.query('SELECT current_database(), now();');
    console.log(`✅ Connected to PostgreSQL database: ${res.rows[0].current_database}`);
  } catch (err) {
    console.error('❌ PostgreSQL connection error on startup:', err.message);
  }
});

const handleShutdown = (signal) => {
  console.log(`
Received ${signal}. Gracefully terminating GIBIConnect server...`);
  server.close(async () => {
    try {
      await pool.end();
      console.log('✅ PostgreSQL connection pool closed cleanly.');
    } catch (err) {
      console.error('Error closing PostgreSQL pool:', err);
    }
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
