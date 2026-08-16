const scholarshipService = require('../services/scholarship.service');
const { scholarshipSchema } = require('../schemas/scholarship.schema');

exports.getScholarshipsByInstitution = async (req, res, next) => {
    try {
        const { institutionId } = req.params;
        const scholarships = await scholarshipService.getScholarshipsByInstitution(institutionId);

        res.json({
            data: scholarships,
            meta: { timestamp: new Date().toISOString() },
            error: null
        });
    } catch (err) {
        next(err);
    }
};

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

        const newScholarship = await scholarshipService.createScholarship(value);

        res.status(201).json({
            data: newScholarship,
            meta: { timestamp: new Date().toISOString() },
            error: null
        });
    } catch (err) {
        next(err);
    }
};