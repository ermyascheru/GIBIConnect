const institutionRepository = require('../repositories/institutions.repository');

const generateSlug = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
};

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

const getInstitutionById = async (id) => {
    return await institutionRepository.findById(id);
};

const createInstitution = async (data) => {
    if (!data.slug && data.name) {
        data.slug = generateSlug(data.name);
    }
    if (!data.ownership) data.ownership = 'public';
    if (!data.city) data.city = 'Addis Ababa';
    if (!data.region) data.region = 'Addis Ababa';
    if (!data.status) data.status = 'published';

    const existing = await institutionRepository.findBySlug(data.slug);
    if (existing) {
        data.slug = `${data.slug}-${Date.now().toString().slice(-4)}`;
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
    getInstitutionById,
    createInstitution,
    updateInstitution,
    deleteInstitution
};
