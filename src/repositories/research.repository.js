const db = require('../config/database');

class ResearchRepository {
  async findAll({ limit = 10, offset = 0 }) {
    const query = 'SELECT * FROM research_papers ORDER BY created_at DESC LIMIT $1 OFFSET $2;';
    const { rows } = await db.query(query, [limit, offset]);
    return rows;
  }
}

module.exports = new ResearchRepository();
