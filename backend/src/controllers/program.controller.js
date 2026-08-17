const db = require('../config/database');
const { programSchema } = require('../schemas/program.schema');

exports.getProgramsByInstitution = async (req, res, next) => {
    try {
        const { institutionId } = req.params;
        const result = await db.query('SELECT * FROM programs WHERE institution_id = $1 ORDER BY id ASC', [institutionId]);
        res.json({ data: result.rows, meta: { timestamp: new Date().toISOString() }, error: null });
    } catch (err) {
        next(err);
    }
};

exports.createProgram = async (req, res, next) => {
    try {
        const { error, value } = programSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: { code: 'VALIDATION_ERROR', message: error.details[0].message }
            });
        }

        const { institution_id, name, degree_level, duration_years, description } = value;
        const result = await db.query(
            'INSERT INTO programs (institution_id, name, degree_level, duration_years, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [institution_id, name, degree_level, duration_years, description]
        );

        res.status(201).json({ data: result.rows[0], meta: { timestamp: new Date().toISOString() }, error: null });
    } catch (err) {
        next(err);
    }
};