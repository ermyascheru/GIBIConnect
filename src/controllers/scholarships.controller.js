const scholarshipsService = require('../services/scholarships.service');
const { successResponse } = require('../utils/response');

const getScholarships = async (req, res, next) => {
    try {
        const data = await scholarshipsService.getAllScholarships(req.query);
        return successResponse(res, 200, 'Scholarships retrieved successfully', data);
    } catch (error) {
        next(error);
    }
};

const getScholarshipById = async (req, res, next) => {
    try {
        const data = await scholarshipsService.getScholarshipById(req.params.id);
        if (!data) {
            const err = new Error('Scholarship not found');
            err.statusCode = 404;
            throw err;
        }
        return successResponse(res, 200, 'Scholarship details retrieved', data);
    } catch (error) {
        next(error);
    }
};

const createScholarship = async (req, res, next) => {
    try {
        const data = await scholarshipsService.createScholarship(req.body);
        return successResponse(res, 201, 'Scholarship created successfully', data);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getScholarships,
    getAllScholarships: getScholarships,
    getScholarshipById,
    createScholarship
};