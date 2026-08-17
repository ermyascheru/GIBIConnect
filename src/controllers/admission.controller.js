const admissionService = require('../services/admission.service');
const { admissionSchema } = require('../schemas/admission.schema');

exports.getAdmissionsByInstitution = async (req, res, next) => {
    try {
        const { institutionId } = req.params;
        const admissions = await admissionService.getAdmissionsByInstitution(institutionId);

        res.json({
            data: admissions,
            meta: { timestamp: new Date().toISOString() },
            error: null
        });
    } catch (err) {
        next(err);
    }
};

exports.createAdmission = async (req, res, next) => {
    try {
        const { error, value } = admissionSchema.validate(req.body || {});
        if (error) {
            return res.status(400).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: { code: 'VALIDATION_ERROR', message: error.details[0].message }
            });
        }

        const newAdmission = await admissionService.createAdmission(value);

        res.status(201).json({
            data: newAdmission,
            meta: { timestamp: new Date().toISOString() },
            error: null
        });
    } catch (err) {
        next(err);
    }
};