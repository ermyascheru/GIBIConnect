const db = require("../config/database");

class CategoriesRepository {
  async findAll() {
    const { rows } = await db.query("SELECT * FROM categories ORDER BY name ASC;");
    return rows;
  }

  async create({ name, slug, description }) {
    const query = "INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3) RETURNING *;";
    const { rows } = await db.query(query, [name, slug, description]);
    return rows[0];
  }
}

module.exports = new CategoriesRepository();
