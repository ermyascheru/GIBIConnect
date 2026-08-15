const db = require('../config/database');

async function getAllInstitutions(){
    const result = await db.query('SELECT * FROM institutions ORDER BY name ASC');
    return result.rows;
}

async function getInstitutionById(id){
    const result = await db.query('SELECT * FROM institutions WHERE id = $1', [id]);
    return result.rows[0];
}

async function createInstitution(institutionData) {
    const result = await db.query('INSERT INTO institutions (name, type, description) VALUES ($1, $2, $3) RETURNING *', [institutionData.name, institutionData.type, institutionData.description]);

    return result.rows[0];
}

async function updateInstitution(id, institutionData){
    const result = await db.query('UPDATE institutions SET name = $1, type = $2, description = $3 WHERE id = $4 RETURNING *',[institutionData.name, institutionData.type, institutionData.description, id]);

    return result.rows[0];
}
module.exports = { getAllInstitutions, getInstitutionById, createInstitution, updateInstitution};
