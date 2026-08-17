const programRepository = require('../repositories/program.repository');

const getProgramsByInstitution = async (institutionId) => {
    return await programRepository.findByInstitutionId(institutionId);
};

const getProgramById = async (id) => {
    return await programRepository.findById(id);
};

const createProgram = async (data) => {
    return await programRepository.create(data);
};

const updateProgram = async (id, data) => {
    return await programRepository.update(id, data);
};

const deleteProgram = async (id) => {
    return await programRepository.deleteById(id);
};

module.exports = {
    getProgramsByInstitution,
    getProgramById,
    createProgram,
    updateProgram,
    deleteProgram
};