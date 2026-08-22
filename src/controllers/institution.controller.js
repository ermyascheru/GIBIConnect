const institutionRepo = require('../repositories/institution.repository');
const { institutionSchema } = require('../validations/institution.validation');

async function getAllInstitutions(req, res, next) {
    try {
        const institutions = await institutionRepo.getAllInstitutions();

        res.status(200).json({
            data: institutions,
            meta: { timestamp: new Date().toISOString() },
            error: null
        })
    } catch (error) {
        next(error);
    }
}


async function getInstitutionById(req, res, next) {
    try {
        const id = req.params.id;
        const institution = await institutionRepo.getInstitutionById(id);

        if (!institution) {
            return res.status(404).json({ data: null, meta: { timestamp: new Date().toISOString() }, error: { code: 'NOT_FOUND', message: 'Institution not found' } });
        }
        res.status(200).json({
            data: institution,
            meta: { timestamp: new Date().toISOString() },
            error: null
        })
    } catch (error) {
        next(error);
    }
}

async function createInstitution(req, res, next) {
    try {
        const { error } = institutionSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: { code: 'VALIDATION_ERROR', message: error.details[0].message }
            });
        }

        const newInstitutionData = req.body;
        const createdInstitution = await institutionRepo.createInstitution(newInstitutionData);

        res.status(201).json({
            data: createdInstitution,
            meta: { timestamp: new Date().toISOString() },
            error: null
        })
    } catch (error) {
        next(error);
    }
}

async function updateInstitution(req, res, next) {
    try {
        const { error } = institutionSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: { code: 'VALIDATION_ERROR', message: error.details[0].message }
            });
        }
        
        const id = req.params.id;
        const data = req.body;

        const updatedInstitution = await institutionRepo.updateInstitution(id, req.body);

        if (!updatedInstitution) {
            return res.status(404).json({ data: null, meta: { timestamp: new Date().toISOString() }, error: { code: 'NOT_FOUND', message: 'Institution not found' } });
        }

        res.status(200).json({
            data: updatedInstitution,
            meta: { timestamp: new Date().toISOString() },
            error: null
        })
    } catch (error) {
        next(error);
    }
}

async function deleteInstitution(req, res, next) {
    try {
        const id = req.params.id;
        const deletedInstitution = await institutionRepo.deleteInstitution(id);
        if (!deletedInstitution) {
            return res.status(404).json({ data: null, meta: { timestamp: new Date().toISOString() }, error: { code: 'NOT_FOUND', message: 'Institution not found' } });
        }
        res.status(200).json({
            data: deletedInstitution,
            meta: { timestamp: new Date().toISOString() },
            error: null
        })
    } catch (error) {
        next(error);
    }
}

module.exports = { getAllInstitutions, getInstitutionById, createInstitution, updateInstitution, deleteInstitution };