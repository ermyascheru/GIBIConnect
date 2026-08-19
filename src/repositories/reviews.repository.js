const db = require("../config/database");

class ReviewsRepository {
  async create({ userId, entityType, entityId, rating, comment }) {
    const query = `
      INSERT INTO reviews (user_id, entity_type, entity_id, rating, comment)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const { rows } = await db.query(query, [userId, entityType, entityId, rating, comment]);
    return rows[0];
  }

  async findByEntity(entityType, entityId) {
    const query = `SELECT * FROM reviews WHERE entity_type = $1 AND entity_id = $2 ORDER BY created_at DESC;`;
    const { rows } = await db.query(query, [entityType, entityId]);
    return rows;
  }
}

module.exports = new ReviewsRepository();
