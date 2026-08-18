const facultyRepository = require('../repositories/faculties.repository');
const institutionRepository = require('../repositories/institutions.repository');

const getFacultiesByInstitution = async (institutionId) => {
    const institution = await institutionRepository.findById(institutionId);
    if (!institution) {
        const error = new Error('Institution not found');
        error.statusCode = 404;
        throw error;
    }
    return await facultyRepository.findByInstitutionId(institutionId);
};

const createFaculty = async (institutionId, data) => {
    const institution = await institutionRepository.findById(institutionId);
    if (!institution) {
        const error = new Error('Institution not found');
        error.statusCode = 404;
        throw error;
    }
    return await facultyRepository.create(institutionId, data);
};

const deleteFaculty = async (id) => {
    const faculty = await facultyRepository.findById(id);
    if (!faculty) {
        const error = new Error('Faculty not found');
        error.statusCode = 404;
        throw error;
    }
    return await facultyRepository.deleteById(id);
};

module.exports = {
    getFacultiesByInstitution,
    createFaculty,
    deleteFaculty
};