const db = require("../config/database");

class UsersRepository {
  async findAll({ page = 1, limit = 10, role, status } = {}) {
    const offset = (page - 1) * limit;
    const params = [];
    let query = "SELECT id, email, role, status, created_at FROM users WHERE 1=1";

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
