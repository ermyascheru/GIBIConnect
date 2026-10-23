const db = require('../config/database');

class ProgramsRepository {
  async findAll({ page = 1, limit = 18, degree_level, study_mode, institution_id, department_id, q, status = 'published' } = {}) {
    const offset = (page - 1) * limit;
    const values = [];
    const conditions = [];

    if (status) {
      values.push(status);
      conditions.push(`p.status = $${values.length}`);
    }
    if (degree_level && degree_level !== 'all') {
      values.push(degree_level.toLowerCase());
      conditions.push(`LOWER(p.degree_level::text) = $${values.length}`);
    }
    if (study_mode && study_mode !== 'all') {
      values.push(study_mode);
      conditions.push(`p.study_mode = $${values.length}`);
    }
    if (institution_id) {
      values.push(institution_id);
      conditions.push(`p.institution_id = $${values.length}`);
    }
    if (department_id) {
      values.push(department_id);
      conditions.push(`p.department_id = $${values.length}`);
    }
    if (q) {
      values.push(`%${q.trim()}%`);
      conditions.push(`(p.name ILIKE $${values.length} OR i.name ILIKE $${values.length} OR d.name ILIKE $${values.length})`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const countResult = await db.query(`
      SELECT COUNT(*) 
      FROM programs p
      JOIN institutions i ON p.institution_id = i.id
      JOIN departments d ON p.department_id = d.id
      ${whereClause}
    `, values);
    const totalCount = parseInt(countResult.rows[0].count, 10);

    values.push(limit, offset);
    const query = `
      SELECT p.id, p.name, p.slug, p.degree_level, p.duration, p.study_mode, p.description,
             p.institution_id, i.name AS institution_name, i.slug AS institution_slug, 
             d.name AS department_name
      FROM programs p
      JOIN institutions i ON p.institution_id = i.id
      JOIN departments d ON p.department_id = d.id
      ${whereClause}
      ORDER BY p.name ASC
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

  async findById(id) {
    const query = `
      SELECT p.*, i.name AS institution_name, i.slug AS institution_slug, 
             d.name AS department_name, f.name AS faculty_name
      FROM programs p
      JOIN institutions i ON p.institution_id = i.id
      JOIN departments d ON p.department_id = d.id
      JOIN faculties f ON d.faculty_id = f.id
      WHERE p.id = $1
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }

  async findByDepartmentId(departmentId) {
    const query = 'SELECT * FROM programs WHERE department_id = $1 ORDER BY name ASC';
    const { rows } = await db.query(query, [departmentId]);
    return rows;
  }

  async findByInstitutionId(institutionId) {
    const query = `
      SELECT p.id, p.name, p.slug, p.degree_level, p.duration, p.study_mode, p.description,
             d.name AS department_name
      FROM programs p
      JOIN departments d ON p.department_id = d.id
      WHERE p.institution_id = $1 AND p.status = 'published'
      ORDER BY p.name ASC
    `;
    const { rows } = await db.query(query, [institutionId]);
    return rows;
  }

  async create(data) {
    const {
      institution_id, department_id, name, slug, degree_level,
      duration, study_mode, description, admission_requirements, status
    } = data;

    const query = `
      INSERT INTO programs 
      (institution_id, department_id, name, slug, degree_level, duration, study_mode, description, admission_requirements, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      institution_id, department_id, name, slug, degree_level,
      duration || null, study_mode, description || null, admission_requirements || null, status || 'draft'
    ];

    const { rows } = await db.query(query, values);
    return rows[0];
  }

  async deleteById(id) {
    const query = 'DELETE FROM programs WHERE id = $1 RETURNING id';
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }
}

module.exports = new ProgramsRepository();
