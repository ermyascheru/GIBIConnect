const db = require('../config/database');

class ResourceRepository {
  async findAll({ limit = 10, offset = 0 }) {
    const query = 'SELECT * FROM resources LIMIT $1 OFFSET $2;';
    const { rows } = await db.query(query, [limit, offset]);
    return rows;
  }
}

module.exports = new ResourceRepository();
