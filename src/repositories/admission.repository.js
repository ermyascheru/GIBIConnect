const db = require('../config/database');

const findByInstitutionId = async (institutionId) => {
    const query = 'SELECT * FROM admissions WHERE institution_id = $1 ORDER BY id ASC';
    const result = await db.query(query, [institutionId]);
    return result.rows;
};

const create = async (admissionData) => {
    const { institution_id, min_gpa, national_exam_cutoff, requirements_text, application_fee } = admissionData;
    const query = `
        INSERT INTO admissions (institution_id, min_gpa, national_exam_cutoff, requirements_text, application_fee)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;
    const result = await db.query(query, [
        institution_id,
        min_gpa || null,
        national_exam_cutoff || null,
        requirements_text,
        application_fee !== undefined ? application_fee : 0.00
    ]);
    return result.rows[0];
};

module.exports = {
    findByInstitutionId,
    create
};