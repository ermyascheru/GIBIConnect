const departmentRepository = require('../repositories/department.repository');
const facultyRepository = require('../repositories/faculty.repository');

const getDepartmentsByFaculty = async (facultyId) => {
    const faculty = await facultyRepository.findById(facultyId);
    if (!faculty) {
        const error = new Error('Faculty not found');
        error.statusCode = 404;
        throw error;
    }
    return await departmentRepository.findByFacultyId(facultyId);
};

const createDepartment = async (facultyId, data) => {
    const faculty = await facultyRepository.findById(facultyId);
    if (!faculty) {
        const error = new Error('Faculty not found');
        error.statusCode = 404;
        throw error;
    }
    return await departmentRepository.create(facultyId, data);
};

module.exports = { getDepartmentsByFaculty, createDepartment };