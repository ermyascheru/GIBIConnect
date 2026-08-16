const db = require('../config/database');

const findByInstitutionId = async (institutionId) => {
    const query = 'SELECT * FROM scholarships WHERE institution_id = $1 ORDER BY id ASC';
    const result = await db.query(query, [institutionId]);
    return result.rows;
};

const create = async (scholarshipData) => {
    const { institution_id, title, amount, eligibility_criteria, deadline } = scholarshipData;
    const query = `
        INSERT INTO scholarships (institution_id, title, amount, eligibility_criteria, deadline)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;
    const result = await db.query(query, [
        institution_id,
        title,
        amount,
        eligibility_criteria,
        deadline
    ]);
    return result.rows[0];
};

module.exports = {
    findByInstitutionId,
    create
};