const scholarshipRepository = require('../repositories/scholarships.repository');

const getAllScholarships = async () => {
    return await scholarshipRepository.findAll();
};

const getScholarshipById = async (id) => {
    return await scholarshipRepository.findById(id);
};

const createScholarship = async (data) => {
    return await scholarshipRepository.create(data);
};

const updateScholarship = async (id, data) => {
    return await scholarshipRepository.update(id, data);
};

const deleteScholarship = async (id) => {
    return await scholarshipRepository.deleteById(id);
};

module.exports = {
    getAllScholarships,
    getScholarshipById,
    createScholarship,
    updateScholarship,
    deleteScholarship
};