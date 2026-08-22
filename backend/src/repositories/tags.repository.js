const db = require('../config/database');

class TagsRepository {
  async findAll() {
    const { rows } = await db.query('SELECT * FROM tags ORDER BY name ASC');
    return rows;
  }

  async findById(id) {
    const { rows } = await db.query('SELECT * FROM tags WHERE id = $1', [id]);
    return rows[0] || null;
  }

  async create({ name, slug }) {
    const query = 'INSERT INTO tags (name, slug) VALUES ($1, $2) RETURNING *';
    const { rows } = await db.query(query, [name, slug]);
    return rows[0];
  }
}

module.exports = new TagsRepository();
