const db = require("../config/db");

class ResearchRepository {
  async findById(id) {
    const query = `
      SELECT 
        r.id, 
        r.abstract, 
        r.citation_count, 
        res.title, 
        res.description, 
        res.url, 
        res.created_at
      FROM research r
      INNER JOIN resources res ON r.resource_id = res.id
      WHERE r.id = $1;
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }
}

module.exports = new ResearchRepository();
