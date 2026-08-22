const db = require('../config/database');

class ScholarshipsRepository {
  async findAll({ page = 1, limit = 10, status = 'published' } = {}) {
    const offset = (page - 1) * limit;
    const countResult = await db.query('SELECT COUNT(*) FROM scholarships WHERE status = $1', [status]);
    const totalCount = parseInt(countResult.rows[0].count, 10);

    const query = `
      SELECT * FROM scholarships 
      WHERE status = $1 
      ORDER BY deadline ASC NULLS LAST, created_at DESC 
      LIMIT $2 OFFSET $3
    `;
    const { rows } = await db.query(query, [status, limit, offset]);
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
      SELECT s.*, 
             COALESCE(json_agg(json_build_object('id', i.id, 'name', i.name, 'slug', i.slug)) FILTER (WHERE i.id IS NOT NULL), '[]') AS institutions
      FROM scholarships s
      LEFT JOIN institution_scholarships ins ON ins.scholarship_id = s.id
      LEFT JOIN institutions i ON i.id = ins.institution_id
      WHERE s.id = $1
      GROUP BY s.id
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }

  async findByInstitutionId(institutionId) {
    const query = `
      SELECT s.* 
      FROM scholarships s
      JOIN institution_scholarships ins ON ins.scholarship_id = s.id
      WHERE ins.institution_id = $1 AND s.status = 'published'
      ORDER BY s.deadline ASC NULLS LAST
    `;
    const { rows } = await db.query(query, [institutionId]);
    return rows;
  }

  async create(data) {
    const { name, slug, description, eligibility, deadline, funding, application_url, status } = data;
    const query = `
      INSERT INTO scholarships (name, slug, description, eligibility, deadline, funding, application_url, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [name, slug, description || null, eligibility || null, deadline || null, funding || null, application_url || null, status || 'draft'];
    const { rows } = await db.query(query, values);
    return rows[0];
  }
}

module.exports = new ScholarshipsRepository();
