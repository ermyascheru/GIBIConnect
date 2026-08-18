const admissionsService = require('../services/admissions.service');
const { successResponse } = require('../utils/response');

const getAdmissions = async (req, res, next) => {
    try {
        const data = await admissionsService.getAllAdmissions(req.query);
        return successResponse(res, 200, 'Admissions retrieved successfully', data);
    } catch (error) {
        next(error);
    }
};

const getAdmissionById = async (req, res, next) => {
    try {
        const data = await admissionsService.getAdmissionById(req.params.id);
        if (!data) {
            const err = new Error('Admission record not found');
            err.statusCode = 404;
            throw err;
        }
        return successResponse(res, 200, 'Admission details retrieved', data);
    } catch (error) {
        next(error);
    }
};

const createAdmission = async (req, res, next) => {
    try {
        const data = await admissionsService.createAdmission(req.body);
        return successResponse(res, 201, 'Admission record created successfully', data);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAdmissions,
    getAllAdmissions: getAdmissions,
    getAdmissionById,
    createAdmission
};