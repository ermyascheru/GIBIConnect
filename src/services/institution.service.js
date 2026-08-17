const institutionRepository = require('../repositories/institution.repository');

const getAllInstitutions = async () => {
    return await institutionRepository.findAll();
};

const getInstitutionById = async (id) => {
    return await institutionRepository.findById(id);
};

const createInstitution = async (data) => {
    return await institutionRepository.create(data);
};

const updateInstitution = async (id, data) => {
    return await institutionRepository.update(id, data);
};

const deleteInstitution = async (id) => {
    return await institutionRepository.deleteById(id);
};

module.exports = {
    getAllInstitutions,
    getInstitutionById,
    createInstitution,
    updateInstitution,
    deleteInstitution
};