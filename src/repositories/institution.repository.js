const db = require('../config/database');

const findAll = async ({ page = 1, limit = 10, q, type, ownership, region, status = 'published' }) => {
    const offset = (page - 1) * limit;
    const values = [];
    const conditions = [];

    // Filter by status if provided (default: published)
    if (status) {
        values.push(status);
        conditions.push(`status = $${values.length}`);
    }

    // Enum & text filters
    if (type) {
        values.push(type);
        conditions.push(`type = $${values.length}`);
    }

    if (ownership) {
        values.push(ownership);
        conditions.push(`ownership = $${values.length}`);
    }

    if (region) {
        values.push(region);
        conditions.push(`region ILIKE $${values.length}`);
    }

    // Full-text search using PostgreSQL tsvector column
    if (q) {
        values.push(q);
        conditions.push(`search_vector @@ plainto_tsquery('english', $${values.length})`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Total Count Query
    const countQuery = `SELECT COUNT(*) FROM institutions ${whereClause}`;
    const countResult = await db.query(countQuery, values);
    const totalCount = parseInt(countResult.rows[0].count, 10);

    // Data Fetch Query
    values.push(limit, offset);
    const dataQuery = `
        SELECT id, name, slug, description, type, ownership, logo_url, city, region, website_url, status, created_at 
        FROM institutions 
        ${whereClause} 
        ORDER BY name ASC 
        LIMIT $${values.length - 1} OFFSET $${values.length}
    `;

    const dataResult = await db.query(dataQuery, values);

    return {
        rows: dataResult.rows,
        totalCount,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalCount / limit)
    };
};

const findBySlug = async (slug) => {
    const query = 'SELECT * FROM institutions WHERE slug = $1';
    const result = await db.query(query, [slug]);
    return result.rows[0];
};

const findById = async (id) => {
    const query = 'SELECT * FROM institutions WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
};

const create = async (data) => {
    const {
        name, slug, description, history, type, ownership,
        logo_url, cover_image_url, website_url, email, phone,
        address, city, region, latitude, longitude, accreditation, status
    } = data;

    const query = `
        INSERT INTO institutions 
        (name, slug, description, history, type, ownership, logo_url, cover_image_url, website_url, email, phone, address, city, region, latitude, longitude, accreditation, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        RETURNING *
    `;

    const values = [
        name, slug, description || null, history || null, type, ownership,
        logo_url || null, cover_image_url || null, website_url || null,
        email || null, phone || null, address || null, city, region,
        latitude || null, longitude || null, accreditation || null, status || 'draft'
    ];

    const result = await db.query(query, values);
    return result.rows[0];
};

module.exports = { findAll, findBySlug, findById, create };