// src/repositories/institutionRepository.js
const pool = require('../config/db');

async function findPublishedBySlug(slug) {
  const { rows } = await pool.query(
    `SELECT i.id, i.name, i.slug, i.description, i.type, i.ownership, i.city, i.region,
            i.website_url, iv.status AS verification_status, iv.verified_at
       FROM institutions i
       LEFT JOIN institution_verification iv ON iv.institution_id = i.id
      WHERE i.slug = $1 AND i.status = 'published'`,
    [slug],
  );
  return rows[0] ?? null;
}

async function searchPublished(query) {
  const { rows } = await pool.query(
    `SELECT id, name, slug, city, region, type,
            ts_rank(search_vector, websearch_to_tsquery('english', $1)) AS rank
       FROM institutions
      WHERE status = 'published'
        AND search_vector @@ websearch_to_tsquery('english', $1)
      ORDER BY rank DESC, name
      LIMIT 20`,
    [query],
  );
  return rows;
}

module.exports = { findPublishedBySlug, searchPublished };
