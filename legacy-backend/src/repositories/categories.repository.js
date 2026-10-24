const db = require('../config/database');

class CategoriesRepository {
  async findAll() {
    const { rows } = await db.query('SELECT * FROM categories ORDER BY name ASC');
    return rows;
  }

  async findById(id) {
    const { rows } = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
    return rows[0] || null;
  }

  async create({ name, slug, description }) {
    const query = 'INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3) RETURNING *';
    const { rows } = await db.query(query, [name, slug, description || null]);
    return rows[0];
  }
}

module.exports = new CategoriesRepository();
