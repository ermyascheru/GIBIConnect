const db = require('../config/database');

const findByInstitutionId = async (institutionId) => {
    const query = 'SELECT * FROM facilities WHERE institution_id = $1 ORDER BY id ASC';
    const result = await db.query(query, [institutionId]);
    return result.rows;
};

const create = async (facilityData) => {
    const { institution_id, name, category, description } = facilityData;
    const query = `
        INSERT INTO facilities (institution_id, name, category, description)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;
    const result = await db.query(query, [institution_id, name, category, description]);
    return result.rows[0];
};

module.exports = {
    findByInstitutionId,
    create
};