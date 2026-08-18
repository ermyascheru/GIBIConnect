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

const updateInstitution = async (id, data) => {
    const existing = await institutionRepository.findById(id);
    if (!existing) {
        const error = new Error('Institution not found');
        error.statusCode = 404;
        throw error;
    }

    if (data.slug && data.slug !== existing.slug) {
        const slugExists = await institutionRepository.findBySlug(data.slug);
        if (slugExists) {
            const error = new Error('An institution with this slug already exists.');
            error.code = 'DUPLICATE_SLUG';
            error.statusCode = 409;
            throw error;
        }
    }

    return await institutionRepository.update(id, data);
};

const deleteInstitution = async (id) => {
    const existing = await institutionRepository.findById(id);
    if (!existing) {
        const error = new Error('Institution not found');
        error.statusCode = 404;
        throw error;
    }

    return await institutionRepository.deleteById(id);
};

module.exports = {
    getAllInstitutions,
    getInstitutionBySlug,
    createInstitution,
    updateInstitution,
    deleteInstitution
};