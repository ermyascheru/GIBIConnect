const admissionService = require('../services/admission.service');
const { admissionSchema } = require('../schemas/admission.schema');

const getByInstitution = async (req, res, next) => {
    try {
        const { institutionId } = req.params;
        const admissions = await admissionService.getAdmissionsByInstitution(institutionId);
        
        return res.status(200).json({
            data: admissions,
            meta: { timestamp: new Date().toISOString() },
            error: null
        });
    } catch (err) {
        next(err);
    }
};

const create = async (req, res, next) => {
    try {
        const { error, value } = admissionSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: error.details[0].message
            });
        }

        const newAdmission = await admissionService.createAdmission(value);
        return res.status(201).json({
            data: newAdmission,
            meta: { timestamp: new Date().toISOString() },
            error: null
        });
    } catch (err) {
        next(err);
    }
};

const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { error, value } = admissionSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: error.details[0].message
            });
        }

        const updated = await admissionService.updateAdmission(id, value);
        if (!updated) {
            return res.status(404).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: 'Admission record not found'
            });
        }

        return res.status(200).json({
            data: updated,
            meta: { timestamp: new Date().toISOString() },
            error: null
        });
    } catch (err) {
        next(err);
    }
};

const remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await admissionService.deleteAdmission(id);
        if (!deleted) {
            return res.status(404).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: 'Admission record not found'
            });
        }

        return res.status(200).json({
            data: deleted,
            meta: { timestamp: new Date().toISOString() },
            error: null
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { getByInstitution, create, update, remove };