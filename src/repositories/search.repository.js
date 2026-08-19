const db = require('../config/database');

class SearchRepository {
  async searchAll(searchTerm) {
    const query = `
      SELECT id, title, description, 'resource' AS type
      FROM resources
      WHERE search_vector @@ websearch_to_tsquery('english', $1)
      UNION ALL
      SELECT id, name AS title, description, 'institution' AS type
      FROM institutions
      WHERE search_vector @@ websearch_to_tsquery('english', $1)
      UNION ALL
      SELECT id, name AS title, description, 'program' AS type
      FROM programs
      WHERE search_vector @@ websearch_to_tsquery('english', $1)
      LIMIT 20;
    `;
    const { rows } = await db.query(query, [searchTerm]);
    return rows;
  }
}

module.exports = new SearchRepository();
