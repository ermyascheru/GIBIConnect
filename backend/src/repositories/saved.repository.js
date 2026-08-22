const db = require('../config/database');

class SavedRepository {
  async getSavedInstitutions(userId) {
    const query = `
      SELECT i.* 
      FROM saved_institutions si
      JOIN institutions i ON i.id = si.institution_id
      WHERE si.user_id = $1
      ORDER BY si.created_at DESC
    `;
    const { rows } = await db.query(query, [userId]);
    return rows;
  }

  async saveInstitution(userId, institutionId) {
    const query = 'INSERT INTO saved_institutions (user_id, institution_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *';
    const { rows } = await db.query(query, [userId, institutionId]);
    return rows[0] || { user_id: userId, institution_id: institutionId };
  }

  async removeSavedInstitution(userId, institutionId) {
    await db.query('DELETE FROM saved_institutions WHERE user_id = $1 AND institution_id = $2', [userId, institutionId]);
  }

  async getSavedPrograms(userId) {
    const query = `
      SELECT p.*, i.name AS institution_name 
      FROM saved_programs sp
      JOIN programs p ON p.id = sp.program_id
      JOIN institutions i ON i.id = p.institution_id
      WHERE sp.user_id = $1
      ORDER BY sp.created_at DESC
    `;
    const { rows } = await db.query(query, [userId]);
    return rows;
  }

  async saveProgram(userId, programId) {
    const query = 'INSERT INTO saved_programs (user_id, program_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *';
    const { rows } = await db.query(query, [userId, programId]);
    return rows[0] || { user_id: userId, program_id: programId };
  }

  async getSavedResources(userId) {
    const query = `
      SELECT r.* 
      FROM resource_bookmarks rb
      JOIN resources r ON r.id = rb.resource_id
      WHERE rb.user_id = $1
      ORDER BY rb.created_at DESC
    `;
    const { rows } = await db.query(query, [userId]);
    return rows;
  }

  async saveResource(userId, resourceId) {
    const query = 'INSERT INTO resource_bookmarks (user_id, resource_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *';
    const { rows } = await db.query(query, [userId, resourceId]);
    return rows[0] || { user_id: userId, resource_id: resourceId };
  }
}

module.exports = new SavedRepository();
