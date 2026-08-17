const db = require('../config/database');

const findByInstitutionId = async (institutionId) => {
    const query = `
        SELECT r.id, r.institution_id, r.user_id, r.rating, r.comment, r.created_at, u.name
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.institution_id = $1
        ORDER BY r.created_at DESC
    `;
    const result = await db.query(query, [institutionId]);
    return result.rows;
};

const create = async (reviewData) => {
    const { institution_id, user_id, rating, comment } = reviewData;
    const query = `
        INSERT INTO reviews (institution_id, user_id, rating, comment)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;
    const result = await db.query(query, [institution_id, user_id, rating, comment]);
    return result.rows[0];
};

module.exports = {
    findByInstitutionId,
    create
};