const facilityService = require('../services/facility.service');
const { facilitySchema } = require('../schemas/facility.schema');

exports.getFacilitiesByInstitution = async (req, res, next) => {
    try {
        const { institutionId } = req.params;
        const facilities = await facilityService.getFacilitiesByInstitution(institutionId);

        res.json({
            data: facilities,
            meta: { timestamp: new Date().toISOString() },
            error: null
        });
    } catch (err) {
        next(err);
    }
};

exports.createFacility = async (req, res, next) => {
    try {
        const { error, value } = facilitySchema.validate(req.body || {});
        if (error) {
            return res.status(400).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: { code: 'VALIDATION_ERROR', message: error.details[0].message }
            });
        }

        const newFacility = await facilityService.createFacility(value);

        res.status(201).json({
            data: newFacility,
            meta: { timestamp: new Date().toISOString() },
            error: null
        });
    } catch (err) {
        next(err);
    }
};