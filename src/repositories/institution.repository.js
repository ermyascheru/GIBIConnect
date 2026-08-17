const db = require('../config/database');

const findAll = async ({ page = 1, limit = 10, q, type, ownership, region, status = 'published' }) => {
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

    if (region) {
        values.push(region);
        conditions.push(`region ILIKE $${values.length}`);
    }

    if (q) {
        values.push(q);
        conditions.push(`search_vector @@ plainto_tsquery('english', $${values.length})`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) FROM institutions ${whereClause}`;
    const countResult = await db.query(countQuery, values);
    const totalCount = parseInt(countResult.rows[0].count, 10);

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

const update = async (id, data) => {
    const {
        name, slug, description, history, type, ownership,
        logo_url, cover_image_url, website_url, email, phone,
        address, city, region, latitude, longitude, accreditation, status
    } = data;

    const query = `
        UPDATE institutions
        SET 
            name = COALESCE($1, name),
            slug = COALESCE($2, slug),
            description = COALESCE($3, description),
            history = COALESCE($4, history),
            type = COALESCE($5, type),
            ownership = COALESCE($6, ownership),
            logo_url = COALESCE($7, logo_url),
            cover_image_url = COALESCE($8, cover_image_url),
            website_url = COALESCE($9, website_url),
            email = COALESCE($10, email),
            phone = COALESCE($11, phone),
            address = COALESCE($12, address),
            city = COALESCE($13, city),
            region = COALESCE($14, region),
            latitude = COALESCE($15, latitude),
            longitude = COALESCE($16, longitude),
            accreditation = COALESCE($17, accreditation),
            status = COALESCE($18, status)
        WHERE id = $19
        RETURNING *
    `;

    const values = [
        name || null, slug || null, description || null, history || null, 
        type || null, ownership || null, logo_url || null, cover_image_url || null, 
        website_url || null, email || null, phone || null, address || null, 
        city || null, region || null, latitude || null, longitude || null, 
        accreditation || null, status || null, id
    ];

    const result = await db.query(query, values);
    return result.rows[0];
};

const deleteById = async (id) => {
    const query = 'DELETE FROM institutions WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows[0];
};

module.exports = {
    findAll,
    findBySlug,
    findById,
    create,
    update,
    deleteById
};