const db = require('../config/database');

class ResearchRepository {
  async findAll({ limit = 10, offset = 0 }) {
    try {
      const query = 'SELECT * FROM research LIMIT $1 OFFSET $2;';
      const { rows } = await db.query(query, [limit, offset]);
      return rows;
    } catch (err) {
      try {
        const query = 'SELECT * FROM research_papers LIMIT $1 OFFSET $2;';
        const { rows } = await db.query(query, [limit, offset]);
        return rows;
      } catch (e) {
        return [];
      }
    }
  }
}

module.exports = new ResearchRepository();
