const db = require('../config/database');

class ResourceRepository {
  async findAll({ limit = 10, offset = 0, category }) {
    const query = `
      SELECT r.*, c.name AS category_name 
      FROM resources r
      LEFT JOIN resource_categories c ON r.category_id = c.id
      WHERE ($1::text IS NULL OR c.slug = $1)
      LIMIT $2 OFFSET $3;
    `;
    const { rows } = await db.query(query, [category || null, limit, offset]);
    return rows;
  }
}

module.exports = new ResourceRepository();
