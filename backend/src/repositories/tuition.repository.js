const db = require('../config/database');

class TuitionRepository {
  async findByInstitutionId(institutionId) {
    const query = `
      SELECT tf.*, p.name AS program_name, p.degree_level
      FROM tuition_fees tf
      LEFT JOIN programs p ON tf.program_id = p.id
      WHERE tf.institution_id = $1
      ORDER BY tf.amount ASC
    `;
    const { rows } = await db.query(query, [institutionId]);
    return rows;
  }

  async findByProgramId(programId) {
    const query = 'SELECT * FROM tuition_fees WHERE program_id = $1';
    const { rows } = await db.query(query, [programId]);
    return rows;
  }

  async create(data) {
    const {
      institution_id, program_id, amount, currency = 'ETB',
      period, additional_fees = 0, effective_date, source
    } = data;

    const query = `
      INSERT INTO tuition_fees
      (institution_id, program_id, amount, currency, period, additional_fees, effective_date, source)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      institution_id, program_id || null, amount, currency,
      period, additional_fees, effective_date, source || null
    ];

    const { rows } = await db.query(query, values);
    return rows[0];
  }
}

module.exports = new TuitionRepository();
