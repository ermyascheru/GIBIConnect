const db = require('../config/database');

class AdmissionsRepository {
  async findAll({ page = 1, limit = 50, degree_level, institution_id } = {}) {
    const offset = (page - 1) * limit;
    const values = [];
    const conditions = [];

    if (degree_level) {
      values.push(degree_level);
      conditions.push(`a.degree_level = $${values.length}`);
    }
    if (institution_id) {
      values.push(institution_id);
      conditions.push(`a.institution_id = $${values.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const countResult = await db.query(`SELECT COUNT(*) FROM admissions a ${whereClause}`, values);
    const totalCount = parseInt(countResult.rows[0].count, 10);

    values.push(limit, offset);
    const query = `
      SELECT a.*, i.name AS institution_name, i.slug AS institution_slug, p.name AS program_name
      FROM admissions a
      JOIN institutions i ON a.institution_id = i.id
      LEFT JOIN programs p ON a.program_id = p.id
      ${whereClause}
      ORDER BY a.created_at DESC
      LIMIT $${values.length - 1} OFFSET $${values.length}
    `;

    const { rows } = await db.query(query, values);
    return {
      rows,
      totalCount,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(totalCount / limit)
    };
  }

  async findByInstitutionId(institutionId) {
    const query = `
      SELECT a.*, p.name AS program_name
      FROM admissions a
      LEFT JOIN programs p ON a.program_id = p.id
      WHERE a.institution_id = $1
      ORDER BY a.created_at DESC
    `;
    const { rows } = await db.query(query, [institutionId]);
    return rows;
  }

  async findById(id) {
    const query = `
      SELECT a.*, i.name AS institution_name, p.name AS program_name
      FROM admissions a
      JOIN institutions i ON a.institution_id = i.id
      LEFT JOIN programs p ON a.program_id = p.id
      WHERE a.id = $1
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }

  async create(data) {
    const {
      institution_id, program_id, degree_level, requirements,
      documents, application_process, application_start, application_end, application_url
    } = data;

    const query = `
      INSERT INTO admissions 
      (institution_id, program_id, degree_level, requirements, documents, application_process, application_start, application_end, application_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      institution_id, program_id || null, degree_level, requirements || null,
      documents || null, application_process || null, application_start || null,
      application_end || null, application_url || null
    ];

    const { rows } = await db.query(query, values);
    return rows[0];
  }

  async update(id, data) {
    const {
      program_id, degree_level, requirements, documents,
      application_process, application_start, application_end, application_url
    } = data;

    const query = `
      UPDATE admissions 
      SET program_id = COALESCE($1, program_id),
          degree_level = COALESCE($2, degree_level),
          requirements = COALESCE($3, requirements),
          documents = COALESCE($4, documents),
          application_process = COALESCE($5, application_process),
          application_start = COALESCE($6, application_start),
          application_end = COALESCE($7, application_end),
          application_url = COALESCE($8, application_url),
          updated_at = NOW()
      WHERE id = $9
      RETURNING *
    `;

    const values = [
      program_id || null, degree_level || null, requirements || null, documents || null,
      application_process || null, application_start || null, application_end || null,
      application_url || null, id
    ];

    const { rows } = await db.query(query, values);
    return rows[0];
  }

  async deleteById(id) {
    const query = 'DELETE FROM admissions WHERE id = $1 RETURNING id';
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }
}

module.exports = new AdmissionsRepository();
