const db = require('../config/database');

class ResearchRepository {
  async findById(id) {
    const query = `
      SELECT 
        r.id, 
        r.abstract, 
        r.research_type,
        r.journal_name,
        r.conference_name,
        r.doi,
        r.keywords,
        r.publication_year,
        res.title, 
        res.description, 
        res.file_extension,
        res.file_size_bytes,
        res.storage_key, 
        res.created_at
      FROM research r
      INNER JOIN resources res ON r.resource_id = res.id
      WHERE r.id = $1;
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }

  async findAll({ limit = 10, offset = 0 } = {}) {
    const query = `
      SELECT 
        r.id, 
        r.abstract, 
        r.research_type,
        r.journal_name,
        r.doi,
        r.publication_year,
        res.title,
        res.file_extension
      FROM research r
      INNER JOIN resources res ON r.resource_id = res.id
      ORDER BY res.created_at DESC
      LIMIT $1 OFFSET $2;
    `;
    const { rows } = await db.query(query, [limit, offset]);
    return rows;
  }
}

module.exports = new ResearchRepository();
