const db = require('../config/database');

class FacultiesRepository {
  async findByInstitutionId(institutionId) {
    const query = 'SELECT * FROM faculties WHERE institution_id = $1 ORDER BY name ASC';
    const { rows } = await db.query(query, [institutionId]);
    return rows;
  }

  async findById(id) {
    const query = 'SELECT * FROM faculties WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }

  async create(institutionId, { name, description }) {
    const query = 'INSERT INTO faculties (institution_id, name, description) VALUES ($1, $2, $3) RETURNING *';
    const { rows } = await db.query(query, [institutionId, name, description || null]);
    return rows[0];
  }

  async deleteById(id) {
    const query = 'DELETE FROM faculties WHERE id = $1 RETURNING id';
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }
}

module.exports = new FacultiesRepository();
