const {Pool} = require('pg');
const env = require('./env');

const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
});

pool.on('connect', () => {
    console.log("Connected to PostgreSQL database");
});

pool.on('error', (err) => {
    console.error("Unexpected error on idle client", err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};