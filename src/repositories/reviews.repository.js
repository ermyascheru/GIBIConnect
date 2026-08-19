const db = require('../config/database');

class ReviewsRepository {
  async create({ institution_id, user_id, teaching_rating, facility_rating, campus_rating, administration_rating, comment }) {
    const query = `
      INSERT INTO reviews (
        institution_id, user_id, teaching_rating, facility_rating, campus_rating, administration_rating, comment, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
      RETURNING *;
    `;
    const values = [institution_id, user_id, teaching_rating, facility_rating, campus_rating, administration_rating, comment || null];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  async findByInstitution(institutionId) {
    const query = `
      SELECT r.*, u.full_name AS reviewer_name 
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.institution_id = $1 AND r.status = 'approved'
      ORDER BY r.created_at DESC;
    `;
    const { rows } = await db.query(query, [institutionId]);
    return rows;
  }
}

module.exports = new ReviewsRepository();
