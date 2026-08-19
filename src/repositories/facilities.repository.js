const db = require("../config/database");

class FacilitiesRepository {
  async findByInstitution(institutionId) {
    const query = "SELECT * FROM facilities WHERE institution_id = $1 ORDER BY name ASC;";
    const { rows } = await db.query(query, [institutionId]);
    return rows;
  }

  async create({ institutionId, name, description, type }) {
    const query = "INSERT INTO facilities (institution_id, name, description, type) VALUES ($1, $2, $3, $4) RETURNING *;";
    const { rows } = await db.query(query, [institutionId, name, description, type]);
    return rows[0];
  }
}

module.exports = new FacilitiesRepository();
