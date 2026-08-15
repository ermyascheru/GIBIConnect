const db = require('../config/database');

async function getAllInstitutions(){
    const result = await db.query('SELECT * FROM institutions ORDER BY name ASC');
    return result.rows;
}

async function getInstitutionById(id){
    const result = await db.query('SELECT * FROM institutions WHERE id = $1', [id]);
    return result.rows[0];
}
module.exports = { getAllInstitutions, getInstitutionById };
