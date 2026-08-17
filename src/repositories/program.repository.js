const db = require('../config/database');

const findAll = async ({ page = 1, limit = 10, q, degree_level, study_mode, status = 'published', institution_id, department_id }) => {
    const offset = (page - 1) * limit;
    const values = [];
    const conditions = [];

    if (status) {
        values.push(status);
        conditions.push(`p.status = $${values.length}`);
    }

    if (degree_level) {
        values.push(degree_level);
        conditions.push(`p.degree_level = $${values.length}`);
    }

    if (study_mode) {
        values.push(study_mode);
        conditions.push(`p.study_mode = $${values.length}`);
    }

    if (institution_id) {
        values.push(institution_id);
        conditions.push(`p.institution_id = $${values.length}`);
    }

    if (department_id) {
        values.push(department_id);
        conditions.push(`p.department_id = $${values.length}`);
    }

    if (q) {
        values.push(q);
        conditions.push(`p.search_vector @@ plainto_tsquery('english', $${values.length})`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) FROM programs p ${whereClause}`;
    const countResult = await db.query(countQuery, values);
    const totalCount = parseInt(countResult.rows[0].count, 10);

    values.push(limit, offset);
    const dataQuery = `
        SELECT 
            p.id, p.institution_id, p.department_id, p.name, p.slug, 
            p.degree_level, p.study_mode, p.duration, p.status, p.created_at,
            i.name AS institution_name,
            d.name AS department_name
        FROM programs p
        LEFT JOIN institutions i ON p.institution_id = i.id
        LEFT JOIN departments d ON p.department_id = d.id
        ${whereClause}
        ORDER BY p.name ASC
        LIMIT $${values.length - 1} OFFSET $${values.length}
    `;

    const dataResult = await db.query(dataQuery, values);

    return {
        rows: dataResult.rows,
        totalCount,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalCount / limit)
    };
};

const findByDepartmentId = async (departmentId) => {
    const query = `
        SELECT id, institution_id, department_id, name, slug, degree_level, study_mode, duration, admission_requirements, status, created_at
        FROM programs
        WHERE department_id = $1
        ORDER BY name ASC
    `;
    const result = await db.query(query, [departmentId]);
    return result.rows;
};


const findById = async (id) => {
    const query = `
        SELECT p.*, d.name AS department_name, f.name AS faculty_name, i.name AS institution_name
        FROM programs p
        LEFT JOIN departments d ON p.department_id = d.id
        LEFT JOIN faculties f ON d.faculty_id = f.id
        LEFT JOIN institutions i ON p.institution_id = i.id
        WHERE p.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
};

const create = async (departmentId, data) => {
    const {
        institution_id,
        name,
        slug,
        description,
        degree_level,
        study_mode,
        duration,
        admission_requirements,
        status
    } = data;

    const query = `
        INSERT INTO programs 
        (institution_id, department_id, name, slug, description, degree_level, study_mode, duration, admission_requirements, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
    `;

    const values = [
        institution_id || null,
        departmentId,
        name,
        slug,
        description || null,
        degree_level,
        study_mode || null,
        duration || null,
        admission_requirements || null,
        status || 'draft'
    ];

    const result = await db.query(query, values);
    return result.rows[0];
};

const deleteById = async (id) => {
    const query = 'DELETE FROM programs WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows[0];
};

module.exports = {
    findAll,
    findByDepartmentId,
    findById,
    create,
    deleteById
};