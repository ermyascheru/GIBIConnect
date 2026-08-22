const db = require('../config/database');

class DepartmentsRepository {
  async findByFacultyId(facultyId) {
    const query = 'SELECT * FROM departments WHERE faculty_id = $1 ORDER BY name ASC';
    const { rows } = await db.query(query, [facultyId]);
    return rows;
  }

  async findById(id) {
    const query = 'SELECT * FROM departments WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }

  async create(facultyId, { name, description }) {
    const query = 'INSERT INTO departments (faculty_id, name, description) VALUES ($1, $2, $3) RETURNING *';
    const { rows } = await db.query(query, [facultyId, name, description || null]);
    return rows[0];
  }

  async deleteById(id) {
    const query = 'DELETE FROM departments WHERE id = $1 RETURNING id';
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }
}

module.exports = new DepartmentsRepository();
