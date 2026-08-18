const db = require('../config/database');

const findAll = async () => {
    const query = 'SELECT * FROM scholarships ORDER BY created_at DESC';
    const result = await db.query(query);
    return result.rows;
};

const findById = async (id) => {
    const query = 'SELECT * FROM scholarships WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
};

const create = async (data) => {
    const { name, slug, description, funding, eligibility, deadline, application_url, status } = data;
    const query = `
        INSERT INTO scholarships 
        (name, slug, description, funding, eligibility, deadline, application_url, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
    `;
    const result = await db.query(query, [
        name, slug || null, description || null, funding || null,
        eligibility || null, deadline || null, application_url || null, status || 'published'
    ]);
    return result.rows[0];
};

const update = async (id, data) => {
    const { name, slug, description, funding, eligibility, deadline, application_url, status } = data;
    const query = `
        UPDATE scholarships
        SET name = COALESCE($1, name),
            slug = COALESCE($2, slug),
            description = COALESCE($3, description),
            funding = COALESCE($4, funding),
            eligibility = COALESCE($5, eligibility),
            deadline = COALESCE($6, deadline),
            application_url = COALESCE($7, application_url),
            status = COALESCE($8, status)
        WHERE id = $9
        RETURNING *
    `;
    const result = await db.query(query, [
        name || null, slug || null, description || null, funding || null,
        eligibility || null, deadline || null, application_url || null, status || null, id
    ]);
    return result.rows[0];
};

const deleteById = async (id) => {
    const query = 'DELETE FROM scholarships WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
};

module.exports = { findAll, findById, create, update, deleteById };