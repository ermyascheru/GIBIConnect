const db = require('../config/database');

const findByInstitutionId = async (institutionId) => {
    const query = `
        SELECT * FROM academic_calendars 
        WHERE institution_id = $1 
        ORDER BY start_date ASC
    `;
    const result = await db.query(query, [institutionId]);
    return result.rows;
};

const create = async (calendarData) => {
    const { institution_id, title, event_type, start_date, end_date, description } = calendarData;
    const query = `
        INSERT INTO academic_calendars (institution_id, title, event_type, start_date, end_date, description)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `;
    const result = await db.query(query, [
        institution_id,
        title,
        event_type,
        start_date,
        end_date || null,
        description || null
    ]);
    return result.rows[0];
};

module.exports = {
    findByInstitutionId,
    create
};