const db = require('../config/database');

class UsersRepository {
  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await db.query(query, [email]);
    return rows[0] || null;
  }

  async findById(id) {
    const query = 'SELECT id, full_name, email, role, status, created_at, updated_at FROM users WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }

  async create({ full_name, email, password_hash, role = 'user' }) {
    const query = `
      INSERT INTO users (full_name, email, password_hash, role, status)
      VALUES ($1, $2, $3, $4, 'active')
      RETURNING id, full_name, email, role, status, created_at
    `;
    const { rows } = await db.query(query, [full_name, email, password_hash, role]);
    return rows[0];
  }

  async findAll({ page = 1, limit = 10, role, status } = {}) {
    const offset = (page - 1) * limit;
    const params = [];
    let query = 'SELECT id, full_name, email, role, status, created_at FROM users WHERE 1=1';

    if (role) {
      params.push(role);
      query += ` AND role = $${params.length}`;
    }
    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }

    params.push(limit, offset);
    query += ` ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

    const { rows } = await db.query(query, params);
    return rows;
  }
}

module.exports = new UsersRepository();
