const db = require('../config/database');

const findByInstitutionId = async (institutionId) => {
    const query = 'SELECT * FROM academic_calendar WHERE institution_id = $1 ORDER BY start_date ASC';
    const result = await db.query(query, [institutionId]);
    return result.rows;
};

const create = async (data) => {
    const { institution_id, title, event_type, start_date, end_date, description } = data;
    const query = `
        INSERT INTO academic_calendar 
        (institution_id, title, event_type, start_date, end_date, description)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `;
    const result = await db.query(query, [
        institution_id, title, event_type, start_date, end_date || null, description || null
    ]);
    return result.rows[0];
};

const update = async (id, data) => {
    const { title, event_type, start_date, end_date, description } = data;
    const query = `
        UPDATE academic_calendar
        SET title = COALESCE($1, title),
            event_type = COALESCE($2, event_type),
            start_date = COALESCE($3, start_date),
            end_date = COALESCE($4, end_date),
            description = COALESCE($5, description)
        WHERE id = $6
        RETURNING *
    `;
    const result = await db.query(query, [
        title || null, event_type || null, start_date || null, end_date || null, description || null, id
    ]);
    return result.rows[0];
};

const deleteById = async (id) => {
    const query = 'DELETE FROM academic_calendar WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
};

module.exports = { findByInstitutionId, create, update, deleteById };