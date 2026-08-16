const scholarshipRepository = require('../repositories/scholarship.repository');

const getScholarshipsByInstitution = async (institutionId) => {
    return await scholarshipRepository.findByInstitutionId(institutionId);
};

const createScholarship = async (scholarshipData) => {
    return await scholarshipRepository.create(scholarshipData);
};

module.exports = {
    getScholarshipsByInstitution,
    createScholarship
};