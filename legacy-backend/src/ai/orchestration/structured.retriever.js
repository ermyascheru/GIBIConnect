const db = require('../../config/database');

class StructuredRetriever {
  async findInstitutions({ name, city, region, type, ownership } = {}) {
    const values = [];
    const conditions = ["status = 'published'"];

    if (name) {
      values.push(`%${name}%`);
      conditions.push(`name ILIKE $${values.length}`);
    }
    if (city) {
      values.push(city);
      conditions.push(`city ILIKE $${values.length}`);
    }
    if (region) {
      values.push(region);
      conditions.push(`region ILIKE $${values.length}`);
    }
    if (type) {
      values.push(type);
      conditions.push(`type = $${values.length}`);
    }

    const query = `
      SELECT id, name, slug, type, ownership, city, region, website_url, accreditation
      FROM institutions
      WHERE ${conditions.join(' AND ')}
      ORDER BY name ASC
      LIMIT 8;
    `;
    const { rows } = await db.query(query, values);
    return rows;
  }

  async findPrograms({ keyword, degree_level, institution_id } = {}) {
    const values = [];
    const conditions = ["p.status = 'published'"];

    if (keyword) {
      values.push(`%${keyword}%`);
      conditions.push(`(p.name ILIKE $${values.length} OR p.description ILIKE $${values.length})`);
    }
    if (degree_level) {
      values.push(degree_level);
      conditions.push(`p.degree_level = $${values.length}`);
    }
    if (institution_id) {
      values.push(institution_id);
      conditions.push(`p.institution_id = $${values.length}`);
    }

    const query = `
      SELECT p.id, p.name AS program_name, p.degree_level, p.study_mode, p.duration,
             p.admission_requirements, i.id AS institution_id, i.name AS institution_name, i.city
      FROM programs p
      JOIN institutions i ON p.institution_id = i.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY i.name ASC, p.name ASC
      LIMIT 10;
    `;
    const { rows } = await db.query(query, values);
    return rows;
  }

  async findTuitionFees({ institution_id, program_id } = {}) {
    const values = [];
    const conditions = [];

    if (institution_id) {
      values.push(institution_id);
      conditions.push(`tf.institution_id = $${values.length}`);
    }
    if (program_id) {
      values.push(program_id);
      conditions.push(`tf.program_id = $${values.length}`);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `
      SELECT tf.amount, tf.currency, tf.period, tf.additional_fees, tf.effective_date,
             i.name AS institution_name, p.name AS program_name
      FROM tuition_fees tf
      JOIN institutions i ON tf.institution_id = i.id
      LEFT JOIN programs p ON tf.program_id = p.id
      ${where}
      ORDER BY tf.amount ASC
      LIMIT 10;
    `;
    const { rows } = await db.query(query, values);
    return rows;
  }

  async findScholarships() {
    const query = `
      SELECT id, name, slug, description, eligibility, deadline, funding, application_url
      FROM scholarships
      WHERE status = 'published'
      ORDER BY deadline ASC NULLS LAST
      LIMIT 8;
    `;
    const { rows } = await db.query(query);
    return rows;
  }
}

module.exports = new StructuredRetriever();
