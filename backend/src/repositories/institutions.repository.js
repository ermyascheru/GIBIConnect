const db = require('../config/database');

class InstitutionsRepository {
  async findAll({ page = 1, limit = 18, q, type, ownership, region, city, status = 'published' } = {}) {
    const offset = (page - 1) * limit;
    const values = [];
    const conditions = [];

    if (status) {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }
    if (type) {
      values.push(type);
      conditions.push(`type = $${values.length}`);
    }
    if (ownership) {
      values.push(ownership);
      conditions.push(`ownership = $${values.length}`);
    }
    if (region && region !== 'all') {
      values.push(region);
      conditions.push(`region ILIKE $${values.length}`);
    }
    if (city) {
      values.push(city);
      conditions.push(`city ILIKE $${values.length}`);
    }
    if (q) {
      values.push(`%${q.trim()}%`);
      conditions.push(`(name ILIKE $${values.length} OR city ILIKE $${values.length} OR region ILIKE $${values.length} OR type::text ILIKE $${values.length})`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) FROM institutions ${whereClause}`;
    const countResult = await db.query(countQuery, values);
    const totalCount = parseInt(countResult.rows[0].count, 10);

    values.push(limit, offset);
    const dataQuery = `
      SELECT id, name, slug, description, type, ownership, logo_url, cover_image_url, 
             city, region, accreditation, status
      FROM institutions
      ${whereClause}
      ORDER BY name ASC
      LIMIT $${values.length - 1} OFFSET $${values.length}
    `;

    const { rows } = await db.query(dataQuery, values);
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
      SELECT i.*, 
             iv.status AS verification_status, 
             iv.verified_at,
             COALESCE(AVG(r.teaching_rating + r.facility_rating + r.campus_rating + r.administration_rating) / 4.0, 4.8)::numeric(3,2) AS average_rating,
             COUNT(DISTINCT r.id)::int AS review_count
      FROM institutions i
      LEFT JOIN institution_verification iv ON iv.institution_id = i.id
      LEFT JOIN reviews r ON r.institution_id = i.id AND r.status = 'approved'
      WHERE i.id = $1
      GROUP BY i.id, iv.status, iv.verified_at
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }

  async findBySlug(slug) {
    const query = `
      SELECT i.*, 
             iv.status AS verification_status, 
             iv.verified_at,
             COALESCE(AVG(r.teaching_rating + r.facility_rating + r.campus_rating + r.administration_rating) / 4.0, 4.8)::numeric(3,2) AS average_rating,
             COUNT(DISTINCT r.id)::int AS review_count
      FROM institutions i
      LEFT JOIN institution_verification iv ON iv.institution_id = i.id
      LEFT JOIN reviews r ON r.institution_id = i.id AND r.status = 'approved'
      WHERE i.slug = $1
      GROUP BY i.id, iv.status, iv.verified_at
    `;
    const { rows } = await db.query(query, [slug]);
    return rows[0] || null;
  }

  async create(data) {
    const {
      name, slug, description, history, type, ownership, logo_url, cover_image_url,
      website_url, email, phone, address, city, region, latitude, longitude, accreditation, status
    } = data;

    const query = `
      INSERT INTO institutions 
      (name, slug, description, history, type, ownership, logo_url, cover_image_url, website_url, email, phone, address, city, region, latitude, longitude, accreditation, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *
    `;

    const values = [
      name, slug, description, history, type, ownership, logo_url, cover_image_url,
      website_url, email, phone, address, city, region, latitude, longitude, accreditation, status || 'published'
    ];

    const { rows } = await db.query(query, values);
    return rows[0];
  }
}

module.exports = new InstitutionsRepository();
