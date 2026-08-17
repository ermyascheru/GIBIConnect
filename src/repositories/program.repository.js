const db = require('../config/database');

const findByInstitutionId = async (institutionId) => {
    const query = 'SELECT * FROM programs WHERE institution_id = $1 ORDER BY name ASC';
    const result = await db.query(query, [institutionId]);
    return result.rows;
};

const findById = async (id) => {
    const query = 'SELECT * FROM programs WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
};

const create = async (data) => {
    const {
        institution_id, department_id, name, degree_level, study_mode,
        slug, duration, description, admission_requirements, status
    } = data;
    const query = `
        INSERT INTO programs 
        (institution_id, department_id, name, degree_level, study_mode, slug, duration, description, admission_requirements, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
    `;
    const result = await db.query(query, [
        institution_id, department_id, name, degree_level, study_mode,
        slug || null, duration || null, description || null,
        admission_requirements || null, status || 'published'
    ]);
    return result.rows[0];
};

const update = async (id, data) => {
    const {
        institution_id, department_id, name, slug, degree_level,
        study_mode, duration, description, admission_requirements, status
    } = data;
    const query = `
        UPDATE programs
        SET institution_id = COALESCE($1, institution_id),
            department_id = COALESCE($2, department_id),
            name = COALESCE($3, name),
            slug = COALESCE($4, slug),
            degree_level = COALESCE($5, degree_level),
            study_mode = COALESCE($6, study_mode),
            duration = COALESCE($7, duration),
            description = COALESCE($8, description),
            admission_requirements = COALESCE($9, admission_requirements),
            status = COALESCE($10, status),
            updated_at = NOW()
        WHERE id = $11
        RETURNING *
    `;
    const result = await db.query(query, [
        institution_id || null, department_id || null, name || null, slug || null,
        degree_level || null, study_mode || null, duration || null,
        description || null, admission_requirements || null, status || null, id
    ]);
    return result.rows[0];
};

const deleteById = async (id) => {
    const query = 'DELETE FROM programs WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
};

module.exports = { findByInstitutionId, findById, create, update, deleteById };