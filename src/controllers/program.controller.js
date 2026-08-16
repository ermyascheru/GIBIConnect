const programService = require('../services/program.service');
const { programSchema } = require('../schemas/program.schema');

exports.getProgramsByInstitution = async (req, res, next) => {
    try {
        const { institutionId } = req.params;
        const programs = await programService.getProgramsByInstitution(institutionId);

        res.json({
            data: programs,
            meta: { timestamp: new Date().toISOString() },
            error: null
        });
    } catch (err) {
        next(err);
    }
};

exports.createProgram = async (req, res, next) => {
    try {
        const { error, value } = programSchema.validate(req.body || {});
        if (error) {
            return res.status(400).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: { code: 'VALIDATION_ERROR', message: error.details[0].message }
            });
        }

        const newProgram = await programService.createProgram(value);

        res.status(201).json({
            data: newProgram,
            meta: { timestamp: new Date().toISOString() },
            error: null
        });
    } catch (err) {
        next(err);
    }
};