const db = require('../config/database');

async function findUserByEmail(email) {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
}

async function findUserById(id) {
    const result = await db.query(
        'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
        [id]
    );
    return result.rows[0];
}

async function createUser(userData) {
    const role = userData.role || 'user';
    const result = await db.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at',
        [userData.name, userData.email, userData.password, role]
    );
    return result.rows[0];
}

module.exports = {
    findUserByEmail,
    findUserById,
    createUser
};