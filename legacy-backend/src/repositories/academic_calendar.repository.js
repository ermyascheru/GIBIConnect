const db = require('../config/database');

class AcademicCalendarRepository {
  async findByInstitutionId(institutionId) {
    const query = 'SELECT * FROM academic_calendar WHERE institution_id = $1 ORDER BY start_date ASC';
    const { rows } = await db.query(query, [institutionId]);
    return rows;
  }

  async create(data) {
    const { institution_id, title, event_type, start_date, end_date, description } = data;
    const query = `
      INSERT INTO academic_calendar 
      (institution_id, title, event_type, start_date, end_date, description)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const { rows } = await db.query(query, [institution_id, title, event_type, start_date, end_date || null, description || null]);
    return rows[0];
  }

  async deleteById(id) {
    const query = 'DELETE FROM academic_calendar WHERE id = $1 RETURNING id';
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }
}

module.exports = new AcademicCalendarRepository();
