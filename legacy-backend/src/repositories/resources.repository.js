const db = require('../config/database');

class ResourcesRepository {
  async findAll({ page = 1, limit = 10, resource_type, file_extension, institution_id, category_id, q, status = 'approved', visibility = 'public' } = {}) {
    const offset = (page - 1) * limit;
    const values = [];
    const conditions = [];

    if (status) {
      values.push(status);
      conditions.push(`r.status = $${values.length}`);
    }
    if (visibility) {
      values.push(visibility);
      conditions.push(`r.visibility = $${values.length}`);
    }
    if (resource_type) {
      values.push(resource_type);
      conditions.push(`r.resource_type = $${values.length}`);
    }
    if (file_extension) {
      values.push(file_extension);
      conditions.push(`r.file_extension = $${values.length}`);
    }
    if (institution_id) {
      values.push(institution_id);
      conditions.push(`r.institution_id = $${values.length}`);
    }
    if (category_id) {
      values.push(category_id);
      conditions.push(`EXISTS (SELECT 1 FROM resource_categories rc WHERE rc.resource_id = r.id AND rc.category_id = $${values.length})`);
    }
    if (q) {
      values.push(q);
      conditions.push(`r.search_vector @@ websearch_to_tsquery('english', $${values.length})`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const countResult = await db.query(`SELECT COUNT(*) FROM resources r ${whereClause}`, values);
    const totalCount = parseInt(countResult.rows[0].count, 10);

    values.push(limit, offset);
    const query = `
      SELECT r.id, r.title, r.description, r.resource_type, r.mime_type, r.file_extension, 
             r.original_filename, r.file_size_bytes, r.publication_year, r.language, r.status, 
             r.visibility, r.created_at,
             i.name AS institution_name, i.slug AS institution_slug,
             (SELECT COUNT(*) FROM resource_views rv WHERE rv.resource_id = r.id)::int AS view_count,
             (SELECT COUNT(*) FROM resource_downloads rd WHERE rd.resource_id = r.id)::int AS download_count
      FROM resources r
      LEFT JOIN institutions i ON r.institution_id = i.id
      ${whereClause}
      ORDER BY r.created_at DESC
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
      SELECT r.*, i.name AS institution_name, i.slug AS institution_slug,
             f.name AS faculty_name, d.name AS department_name, p.name AS program_name,
             COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', c.id, 'name', c.name, 'slug', c.slug)) FILTER (WHERE c.id IS NOT NULL), '[]'::jsonb) AS categories,
             COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug)) FILTER (WHERE t.id IS NOT NULL), '[]'::jsonb) AS tags,
             (SELECT COUNT(*) FROM resource_views rv WHERE rv.resource_id = r.id)::int AS view_count,
             (SELECT COUNT(*) FROM resource_downloads rd WHERE rd.resource_id = r.id)::int AS download_count
      FROM resources r
      LEFT JOIN institutions i ON r.institution_id = i.id
      LEFT JOIN faculties f ON r.faculty_id = f.id
      LEFT JOIN departments d ON r.department_id = d.id
      LEFT JOIN programs p ON r.program_id = p.id
      LEFT JOIN resource_categories rc ON rc.resource_id = r.id
      LEFT JOIN categories c ON c.id = rc.category_id
      LEFT JOIN resource_tags rt ON rt.resource_id = r.id
      LEFT JOIN tags t ON t.id = rt.tag_id
      WHERE r.id = $1
      GROUP BY r.id, i.name, i.slug, f.name, d.name, p.name
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }

  async create(data) {
    const {
      title, description, resource_type, mime_type, file_extension,
      original_filename, file_size_bytes, storage_provider = 'local',
      storage_bucket, storage_key, checksum, uploaded_by,
      institution_id, faculty_id, department_id, program_id,
      publication_year, language = 'en', status = 'pending', visibility = 'public'
    } = data;

    const query = `
      INSERT INTO resources (
        title, description, resource_type, mime_type, file_extension,
        original_filename, file_size_bytes, storage_provider, storage_bucket,
        storage_key, checksum, uploaded_by, institution_id, faculty_id,
        department_id, program_id, publication_year, language, status, visibility
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING *
    `;

    const values = [
      title, description || null, resource_type, mime_type, file_extension,
      original_filename, file_size_bytes, storage_provider, storage_bucket || null,
      storage_key, checksum || null, uploaded_by || null, institution_id || null,
      faculty_id || null, department_id || null, program_id || null,
      publication_year || null, language, status, visibility
    ];

    const { rows } = await db.query(query, values);
    return rows[0];
  }

  async logView(resourceId, userId = null, ipHash = null) {
    await db.query('INSERT INTO resource_views (resource_id, user_id, ip_hash) VALUES ($1, $2, $3)', [resourceId, userId, ipHash]);
  }

  async logDownload(resourceId, userId = null, ipHash = null) {
    await db.query('INSERT INTO resource_downloads (resource_id, user_id, ip_hash) VALUES ($1, $2, $3)', [resourceId, userId, ipHash]);
  }
}

module.exports = new ResourcesRepository();
