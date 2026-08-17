const db = require('../config/database');

const findAll = async () => {
    const query = 'SELECT * FROM institutions ORDER BY name ASC';
    const result = await db.query(query);
    return result.rows;
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
        name,
        slug,
        description || null,
        history || null,
        type,
        ownership,
        logo_url || null,
        cover_image_url || null,
        website_url || null,
        email || null,
        phone || null,
        address || null,
        city,
        region,
        latitude || null,
        longitude || null,
        accreditation || null,
        status || 'draft'
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
        SET name = COALESCE($1, name),
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
            status = COALESCE($18, status),
            updated_at = NOW()
        WHERE id = $19
        RETURNING *
    `;

    const values = [
        name || null,
        slug || null,
        description || null,
        history || null,
        type || null,
        ownership || null,
        logo_url || null,
        cover_image_url || null,
        website_url || null,
        email || null,
        phone || null,
        address || null,
        city || null,
        region || null,
        latitude || null,
        longitude || null,
        accreditation || null,
        status || null,
        id
    ];

    const result = await db.query(query, values);
    return result.rows[0];
};

const deleteById = async (id) => {
    const query = 'DELETE FROM institutions WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
};


const findBySlug = async (slug) => {
    const query = 'SELECT id FROM institutions WHERE slug = $1';
    const result = await db.query(query, [slug]);
    return result.rows[0];
};


module.exports = { 
    findAll, 
    findById, 
    findBySlug, 
    create, 
    update, 
    deleteById 
};