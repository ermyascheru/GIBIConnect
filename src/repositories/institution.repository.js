const db = require('../config/database');

async function getAllInstitutions(){
    const result = await db.query('SELECT * FROM institutions ORDER BY name ASC');
    return result.rows;
}

module.exports = {getAllInstitutions};