const db = require('../config/database');

const findByDepartmentId = async (departmentId) => {
    const query = `
        SELECT id, institution_id, department_id, name, slug, degree_level, study_mode, duration, admission_requirements, status, created_at
        FROM programs
        WHERE department_id = $1
        ORDER BY name ASC
    `;
    const result = await db.query(query, [departmentId]);
    return result.rows;
};

const findById = async (id) => {
    const query = `
        SELECT p.*, d.name AS department_name, f.name AS faculty_name, i.name AS institution_name
        FROM programs p
        LEFT JOIN departments d ON p.department_id = d.id
        LEFT JOIN faculties f ON d.faculty_id = f.id
        LEFT JOIN institutions i ON p.institution_id = i.id
        WHERE p.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
};

const create = async (departmentId, data) => {
    const {
        institution_id,
        name,
        slug,
        description,
        degree_level,
        study_mode,
        duration,
        admission_requirements,
        status
    } = data;

    const query = `
        INSERT INTO programs 
        (institution_id, department_id, name, slug, description, degree_level, study_mode, duration, admission_requirements, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
    `;

    const values = [
        institution_id || null,
        departmentId,
        name,
        slug,
        description || null,
        degree_level,
        study_mode || null,
        duration || null,
        admission_requirements || null,
        status || 'draft'
    ];

    const result = await db.query(query, values);
    return result.rows[0];
};

const deleteById = async (id) => {
    const query = 'DELETE FROM programs WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows[0];
};

module.exports = {
    findByDepartmentId,
    findById,
    create,
    deleteById
};