const db = require('../config/database');

class SearchRepository {
  async globalSearch(term) {
    const query = `
      SELECT 'institution' AS type, id, name AS title FROM institutions WHERE name ILIKE $1
      UNION ALL
      SELECT 'program' AS type, id, name AS title FROM programs WHERE name ILIKE $1
      UNION ALL
      SELECT 'resource' AS type, id, title FROM resources WHERE title ILIKE $1
      LIMIT 20;
    `;
    const { rows } = await db.query(query, [`%${term}%`]);
    return rows;
  }
}

module.exports = new SearchRepository();
