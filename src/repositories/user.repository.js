const db = require('../config/database');

const findByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
};

const findById = async (id) => {
    const query = 'SELECT id, full_name, email, role, created_at FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
};

const create = async ({ full_name, email, password_hash, role = 'user' }) => {
    const query = `
        INSERT INTO users (full_name, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, full_name, email, role, created_at
    `;
    const result = await db.query(query, [full_name, email, password_hash, role]);
    return result.rows[0];
};

module.exports = {
    findByEmail,
    findById,
    create
};