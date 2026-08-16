const facilityRepository = require('../repositories/facility.repository');

const getFacilitiesByInstitution = async (institutionId) => {
    return await facilityRepository.findByInstitutionId(institutionId);
};

const createFacility = async (facilityData) => {
    return await facilityRepository.create(facilityData);
};

module.exports = {
    getFacilitiesByInstitution,
    createFacility
};