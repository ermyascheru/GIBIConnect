const db = require('../config/database');
const { scholarshipSchema } = require('../schemas/scholarship.schema');

exports.getScholarshipsByInstitution = async (req, res, next) => {
    try {
        const { institutionId } = req.params;

        const result = await db.query('SELECT * FROM scholarships WHERE institution_id = $1', [institutionId]);
        res.json({ data: result.rows, meta: { timestamp: new Date().toISOString() }, error: null });
    } catch (err) {
        next(err);
    }
}

exports.createScholarship = async (req, res, next) => {
    try {
        const { error, value } = scholarshipSchema.validate(req.body || {});

        if (error) {
            return res.status(400).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: { code: 'VALIDATION_ERROR', message: error.details[0].message }
            });
        }

        const { institution_id, title, amount, eligibility_criteria, deadline } = value;
        const result = await db.query(
            'INSERT INTO scholarships (institution_id, title, amount, eligibility_criteria, deadline) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [institution_id, title, amount, eligibility_criteria, deadline]
        );

        res.status(201).json({ data: result.rows[0], meta: { timestamp: new Date().toISOString() }, error: null });
    } catch (err) {
        next(err);
    }
}