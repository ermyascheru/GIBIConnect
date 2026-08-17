const db = require('../config/database');

const save = async (userId, institutionId) => {
    const query = `
        INSERT INTO saved_institutions (user_id, institution_id)
        VALUES ($1, $2)
        RETURNING *
    `;
    const result = await db.query(query, [userId, institutionId]);
    return result.rows[0];
};

const findByUserId = async (userId) => {
    const query = `
        SELECT si.id AS saved_id, si.created_at AS saved_at, i.*
        FROM saved_institutions si
        JOIN institutions i ON si.institution_id = i.id
        WHERE si.user_id = $1
        ORDER BY si.created_at DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

const remove = async (userId, institutionId) => {
    const query = `
        DELETE FROM saved_institutions
        WHERE user_id = $1 AND institution_id = $2
        RETURNING *
    `;
    const result = await db.query(query, [userId, institutionId]);
    return result.rows[0];
};

module.exports = {
    save,
    findByUserId,
    remove
};