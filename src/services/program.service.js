const programRepository = require('../repositories/program.repository');
const departmentRepository = require('../repositories/department.repository');

const getProgramsByDepartment = async (departmentId) => {
    return await programRepository.findByDepartmentId(departmentId);
};

const getProgramById = async (id) => {
    const program = await programRepository.findById(id);
    if (!program) {
        const error = new Error('Program not found');
        error.statusCode = 404;
        throw error;
    }
    return program;
};

const createProgram = async (departmentId, data) => {
    return await programRepository.create(departmentId, data);
};

const deleteProgram = async (id) => {
    const existing = await programRepository.findById(id);
    if (!existing) {
        const error = new Error('Program not found');
        error.statusCode = 404;
        throw error;
    }
    return await programRepository.deleteById(id);
};

module.exports = {
    getProgramsByDepartment,
    getProgramById,
    createProgram,
    deleteProgram
};