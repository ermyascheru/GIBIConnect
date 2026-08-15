const institutionRepo = require('../repositories/institution.repository');

async function getAllInstitutions(req, res, next) {
    try {
        const institutions = await institutionRepo.getAllInstitutions();

        res.status(200).json({
            data: institutions,
            meta: {timestamp: new Date().toISOString()},
            error: null
        })
    } catch (error) {
        next(error);
    }
}

module.exports = { getAllInstitutions };