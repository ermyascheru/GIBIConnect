const savedInstitutionRepository = require('../repositories/saved_institution.repository');

const saveInstitution = async (userId, institutionId) => {
    return await savedInstitutionRepository.save(userId, institutionId);
};

const getSavedInstitutions = async (userId) => {
    return await savedInstitutionRepository.findByUserId(userId);
};

const removeSavedInstitution = async (userId, institutionId) => {
    return await savedInstitutionRepository.remove(userId, institutionId);
};

module.exports = {
    saveInstitution,
    getSavedInstitutions,
    removeSavedInstitution
};