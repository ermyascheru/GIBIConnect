const db = require('../config/database');

const findByInstitutionId = async (institutionId) => {
    const query = 'SELECT * FROM programs WHERE institution_id = $1 ORDER BY id ASC';
    const result = await db.query(query, [institutionId]);
    return result.rows;
};

const create = async (programData) => {
    const { institution_id, name, degree_level, duration_years, description } = programData;
    const query = `
        INSERT INTO programs (institution_id, name, degree_level, duration_years, description)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;
    const result = await db.query(query, [
        institution_id,
        name,
        degree_level,
        duration_years,
        description
    ]);
    return result.rows[0];
};

module.exports = {
    findByInstitutionId,
    create
};