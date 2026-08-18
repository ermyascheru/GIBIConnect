const admissionRepository = require('../repositories/admission.repository');

const getAdmissionsByInstitution = async (institutionId) => {
    return await admissionRepository.findByInstitutionId(institutionId);
};

const createAdmission = async (data) => {
    return await admissionRepository.create(data);
};

const updateAdmission = async (id, data) => {
    return await admissionRepository.update(id, data);
};

const deleteAdmission = async (id) => {
    return await admissionRepository.deleteById(id);
};

module.exports = {
    getAdmissionsByInstitution,
    createAdmission,
    updateAdmission,
    deleteAdmission
};