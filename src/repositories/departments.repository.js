const db = require('../config/database');

const findByFacultyId = async (facultyId) => {
    const query = `
        SELECT id, faculty_id, name, description 
        FROM departments 
        WHERE faculty_id = $1 
        ORDER BY name ASC
    `;
    const result = await db.query(query, [facultyId]);
    return result.rows;
};

const create = async (facultyId, { name, description }) => {
    const query = `
        INSERT INTO departments (faculty_id, name, description) 
        VALUES ($1, $2, $3) 
        RETURNING *
    `;
    const result = await db.query(query, [facultyId, name, description || null]);
    return result.rows[0];
};

const deleteById = async (id) => {
    const query = 'DELETE FROM departments WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows[0];
};

module.exports = { 
    findByFacultyId, 
    create, 
    deleteById 
};