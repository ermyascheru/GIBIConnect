const db = require('../config/database');

class FacilitiesRepository {
  async findByInstitutionId(institutionId) {
    const query = 'SELECT * FROM facilities WHERE institution_id = $1 ORDER BY type, name ASC';
    const { rows } = await db.query(query, [institutionId]);
    return rows;
  }

  async create(data) {
    const { institution_id, name, type, description } = data;
    const query = 'INSERT INTO facilities (institution_id, name, type, description) VALUES ($1, $2, $3, $4) RETURNING *';
    const { rows } = await db.query(query, [institution_id, name, type, description || null]);
    return rows[0];
  }

  async deleteById(id) {
    const query = 'DELETE FROM facilities WHERE id = $1 RETURNING id';
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }
}

module.exports = new FacilitiesRepository();
