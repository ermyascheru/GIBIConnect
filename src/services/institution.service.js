const institutionRepository = require('../repositories/institution.repository');

const getAllInstitutions = async (queryParams) => {
    return await institutionRepository.findAll(queryParams);
};

const getInstitutionBySlug = async (slug) => {
    const institution = await institutionRepository.findBySlug(slug);
    if (!institution) {
        const error = new Error('Institution not found');
        error.statusCode = 404;
        throw error;
    }
    return institution;
};

const createInstitution = async (data) => {
    const existing = await institutionRepository.findBySlug(data.slug);
    if (existing) {
        const error = new Error('An institution with this slug already exists.');
        error.code = 'DUPLICATE_SLUG';
        error.statusCode = 409;
        throw error;
    }
    return await institutionRepository.create(data);
};

module.exports = {
    getAllInstitutions,
    getInstitutionBySlug,
    createInstitution
};