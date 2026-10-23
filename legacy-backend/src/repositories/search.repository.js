const db = require('../config/database');

class SearchRepository {
  async searchAll(searchTerm) {
    const query = `
      SELECT id, title, description, 'resource' AS entity_type,
             ts_rank_cd(search_vector, websearch_to_tsquery('english', $1)) AS rank
      FROM resources
      WHERE search_vector @@ websearch_to_tsquery('english', $1)
      UNION ALL
      SELECT id, name AS title, description, 'institution' AS entity_type,
             ts_rank_cd(search_vector, websearch_to_tsquery('english', $1)) AS rank
      FROM institutions
      WHERE search_vector @@ websearch_to_tsquery('english', $1)
      UNION ALL
      SELECT id, name AS title, description, 'program' AS entity_type,
             ts_rank_cd(search_vector, websearch_to_tsquery('english', $1)) AS rank
      FROM programs
      WHERE search_vector @@ websearch_to_tsquery('english', $1)
      ORDER BY rank DESC
      LIMIT 20;
    `;
    const { rows } = await db.query(query, [searchTerm]);
    return rows;
  }
}

module.exports = new SearchRepository();
