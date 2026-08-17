const db = require('../config/database');

const findByInstitutionId = async (institutionId) => {
    const query = 'SELECT * FROM admissions WHERE institution_id = $1 ORDER BY created_at DESC';
    const result = await db.query(query, [institutionId]);
    return result.rows;
};

const create = async (admissionData) => {
    const { 
        institution_id, program_id, degree_level, requirements, 
        documents, application_process, application_start, application_end, application_url 
    } = admissionData;

    const query = `
        INSERT INTO admissions 
        (institution_id, program_id, degree_level, requirements, documents, application_process, application_start, application_end, application_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
    `;
    const result = await db.query(query, [
        institution_id, program_id || null, degree_level, requirements || null,
        documents || null, application_process || null, application_start || null, 
        application_end || null, application_url || null
    ]);
    return result.rows[0];
};

module.exports = { findByInstitutionId, create };