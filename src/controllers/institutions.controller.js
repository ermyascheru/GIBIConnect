const institutionService = require('../services/institutions.service');

const getInstitutions = async (req, res, next) => {
    try {
        const { page, limit, q, type, ownership, region, status } = req.query;

        const result = await institutionService.getAllInstitutions({
            page: parseInt(page, 10) || 1,
            limit: parseInt(limit, 10) || 10,
            q,
            type,
            ownership,
            region,
            status
        });

        return res.status(200).json({
            data: result.rows,
            meta: {
                page: result.page,
                limit: result.limit,
                totalCount: result.totalCount,
                totalPages: result.totalPages,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        next(error);
    }
};

const getInstitutionBySlug = async (req, res, next) => {
    try {
        const institution = await institutionService.getInstitutionBySlug(req.params.slug);
        return res.status(200).json({
            data: institution,
            meta: { timestamp: new Date().toISOString() }
        });
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({
                data: null,
                error: { code: 'NOT_FOUND', message: error.message }
            });
        }
        next(error);
    }
};

const createInstitution = async (req, res, next) => {
    try {
        const institution = await institutionService.createInstitution(req.body);
        return res.status(201).json({
            data: institution,
            meta: { timestamp: new Date().toISOString() }
        });
    } catch (error) {
        if (error.statusCode === 409 || error.code === '23505') {
            return res.status(409).json({
                data: null,
                error: {
                    code: 'DUPLICATE_SLUG',
                    message: 'An institution with this slug already exists.'
                }
            });
        }
        next(error);
    }
};

const updateInstitution = async (req, res, next) => {
    try {
        const updated = await institutionService.updateInstitution(req.params.id, req.body);
        return res.status(200).json({
            data: updated,
            meta: { timestamp: new Date().toISOString() }
        });
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({
                data: null,
                error: { code: 'NOT_FOUND', message: error.message }
            });
        }
        if (error.statusCode === 409 || error.code === '23505') {
            return res.status(409).json({
                data: null,
                error: { code: 'DUPLICATE_SLUG', message: error.message }
            });
        }
        next(error);
    }
};

const deleteInstitution = async (req, res, next) => {
    try {
        await institutionService.deleteInstitution(req.params.id);
        return res.status(200).json({
            data: { message: 'Institution deleted successfully' },
            meta: { timestamp: new Date().toISOString() }
        });
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({
                data: null,
                error: { code: 'NOT_FOUND', message: error.message }
            });
        }
        if (error.code === '23503') {
            return res.status(409).json({
                data: null,
                error: {
                    code: 'FOREIGN_KEY_CONSTRAINT',
                    message: 'Cannot delete institution because it has linked faculties, programs, or records.'
                }
            });
        }
        next(error);
    }
};

module.exports = {
    getInstitutions,
    getInstitutionBySlug,
    createInstitution,
    updateInstitution,
    deleteInstitution
};