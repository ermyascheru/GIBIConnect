const db = require('../config/database');

async function findUserByEmail(email){
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
}

async function createUser(userData) {
const result = await db.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role, created_at', 
        [userData.name, userData.email, userData.password]
    );
    return result.rows[0];
}

module.exports = { findUserByEmail, createUser};