const db = require('../config/database');

class ResearchRepository {
  async findAll({ page = 1, limit = 10, research_type, institution_id, q } = {}) {
    const offset = (page - 1) * limit;
    const values = [];
    const conditions = ["r.status = 'approved'", "r.visibility = 'public'"];

    if (research_type) {
      values.push(research_type);
      conditions.push(`res.research_type = $${values.length}`);
    }
    if (institution_id) {
      values.push(institution_id);
      conditions.push(`r.institution_id = $${values.length}`);
    }
    if (q) {
      values.push(q);
      conditions.push(`res.search_vector @@ websearch_to_tsquery('english', $${values.length})`);
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;
    const countResult = await db.query(
      `SELECT COUNT(*) FROM research res JOIN resources r ON r.id = res.resource_id ${whereClause}`,
      values
    );
    const totalCount = parseInt(countResult.rows[0].count, 10);

    values.push(limit, offset);
    const query = `
      SELECT res.id, res.abstract, res.research_type, res.publication_date, res.publication_year,
             res.journal_name, res.conference_name, res.doi, res.keywords,
             r.id AS resource_id, r.title, r.file_extension, r.file_size_bytes, r.created_at,
             i.name AS institution_name, i.slug AS institution_slug,
             COALESCE(json_agg(json_build_object(
               'id', a.id,
               'name', a.full_name,
               'order', ra.author_order,
               'is_corresponding', ra.is_corresponding
             ) ORDER BY ra.author_order) FILTER (WHERE a.id IS NOT NULL), '[]') AS authors
      FROM research res
      JOIN resources r ON r.id = res.resource_id
      LEFT JOIN institutions i ON r.institution_id = i.id
      LEFT JOIN research_authors ra ON ra.research_id = res.id
      LEFT JOIN authors a ON a.id = ra.author_id
      ${whereClause}
      GROUP BY res.id, r.id, i.name, i.slug
      ORDER BY res.publication_year DESC NULLS LAST, r.created_at DESC
      LIMIT $${values.length - 1} OFFSET $${values.length}
    `;

    const { rows } = await db.query(query, values);
    return {
      rows,
      totalCount,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(totalCount / limit)
    };
  }

  async findById(id) {
    const query = `
      SELECT res.*, r.title, r.description, r.file_extension, r.file_size_bytes, r.storage_key, r.created_at,
             i.name AS institution_name, i.slug AS institution_slug,
             COALESCE(json_agg(json_build_object(
               'id', a.id,
               'full_name', a.full_name,
               'email', a.email,
               'affiliation', a.affiliation,
               'orcid', a.orcid,
               'order', ra.author_order,
               'is_corresponding', ra.is_corresponding
             ) ORDER BY ra.author_order) FILTER (WHERE a.id IS NOT NULL), '[]') AS authors
      FROM research res
      JOIN resources r ON r.id = res.resource_id
      LEFT JOIN institutions i ON r.institution_id = i.id
      LEFT JOIN research_authors ra ON ra.research_id = res.id
      LEFT JOIN authors a ON a.id = ra.author_id
      WHERE res.id = $1
      GROUP BY res.id, r.title, r.description, r.file_extension, r.file_size_bytes, r.storage_key, r.created_at, i.name, i.slug
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }
}

module.exports = new ResearchRepository();
