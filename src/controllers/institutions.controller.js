const institutionsService = require('../services/institutions.service');
const { successResponse } = require('../utils/response');

const getAllInstitutions = async (req, res, next) => {
    try {
        const data = await institutionsService.getAllInstitutions(req.query);
        return successResponse(res, 200, 'Institutions retrieved successfully', data);
    } catch (error) {
        next(error);
    }
};

const getInstitutionById = async (req, res, next) => {
    try {
        const data = await institutionsService.getInstitutionById(req.params.id);
        if (!data) {
            const err = new Error('Institution not found');
            err.statusCode = 404;
            throw err;
        }
        return successResponse(res, 200, 'Institution details retrieved', data);
    } catch (error) {
        next(error);
    }
};

const createInstitution = async (req, res, next) => {
    try {
        const data = await institutionsService.createInstitution(req.body);
        return successResponse(res, 201, 'Institution created successfully', data);
    } catch (error) {
        next(error);
    }
};

const deleteInstitution = async (req, res, next) => {
    try {
        await institutionsService.deleteInstitution(req.params.id);
        return successResponse(res, 200, 'Institution deleted successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllInstitutions,
    getInstitutionById,
    createInstitution,
    deleteInstitution
};
