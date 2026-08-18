const db = require('../config/database');

const findByInstitutionId = async (institutionId) => {
    const query = `
        SELECT id, institution_id, name, description 
        FROM faculties 
        WHERE institution_id = $1 
        ORDER BY name ASC
    `;
    const result = await db.query(query, [institutionId]);
    return result.rows;
};

const findById = async (id) => {
    const query = 'SELECT * FROM faculties WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
};

const create = async (institutionId, { name, description }) => {
    const query = `
        INSERT INTO faculties (institution_id, name, description)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    const result = await db.query(query, [institutionId, name, description || null]);
    return result.rows[0];
};

const deleteById = async (id) => {
    const query = 'DELETE FROM faculties WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows[0];
};

module.exports = {
    findByInstitutionId,
    findById,
    create,
    deleteById
};