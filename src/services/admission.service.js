const admissionRepository = require('../repositories/admission.repository');

const getAdmissionsByInstitution = async (institutionId) => {
    return await admissionRepository.findByInstitutionId(institutionId);
};

const createAdmission = async (admissionData) => {
    return await admissionRepository.create(admissionData);
};

module.exports = {
    getAdmissionsByInstitution,
    createAdmission
};