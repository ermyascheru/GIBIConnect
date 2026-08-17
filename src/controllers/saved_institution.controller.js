const savedInstitutionService = require('../services/saved_institution.service');
const { savedInstitutionSchema } = require('../schemas/saved_institution.schema');

exports.saveInstitution = async (req, res, next) => {
    try {
        const { error, value } = savedInstitutionSchema.validate(req.body || {});
        if (error) {
            return res.status(400).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: { code: 'VALIDATION_ERROR', message: error.details[0].message }
            });
        }

        const savedItem = await savedInstitutionService.saveInstitution(req.user.id, value.institution_id);

        res.status(201).json({
            data: savedItem,
            meta: { timestamp: new Date().toISOString() },
            error: null
        });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: { code: 'DUPLICATE_ENTRY', message: 'Institution is already saved' }
            });
        }
        next(err);
    }
};

exports.getSavedInstitutions = async (req, res, next) => {
    try {
        const savedList = await savedInstitutionService.getSavedInstitutions(req.user.id);

        res.json({
            data: savedList,
            meta: { timestamp: new Date().toISOString() },
            error: null
        });
    } catch (err) {
        next(err);
    }
};

exports.removeSavedInstitution = async (req, res, next) => {
    try {
        const { institutionId } = req.params;
        const removedItem = await savedInstitutionService.removeSavedInstitution(req.user.id, institutionId);

        if (!removedItem) {
            return res.status(404).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: { code: 'NOT_FOUND', message: 'Saved institution record not found' }
            });
        }

        res.json({
            data: { message: 'Institution removed from saved list' },
            meta: { timestamp: new Date().toISOString() },
            error: null
        });
    } catch (err) {
        next(err);
    }
};