const programRepository = require('../repositories/program.repository');

const getProgramsByInstitution = async (institutionId) => {
    return await programRepository.findByInstitutionId(institutionId);
};

const createProgram = async (programData) => {
    return await programRepository.create(programData);
};

module.exports = {
    getProgramsByInstitution,
    createProgram
};