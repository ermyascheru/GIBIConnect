const facultiesService = require('../services/faculties.service');
const { successResponse } = require('../utils/response');

const getFaculties = async (req, res, next) => {
    try {
        const data = await facultiesService.getAllFaculties(req.query);
        return successResponse(res, 200, 'Faculties retrieved successfully', data);
    } catch (error) {
        next(error);
    }
};

const getFacultyById = async (req, res, next) => {
    try {
        const data = await facultiesService.getFacultyById(req.params.id);
        if (!data) {
            const err = new Error('Faculty not found');
            err.statusCode = 404;
            throw err;
        }
        return successResponse(res, 200, 'Faculty details retrieved', data);
    } catch (error) {
        next(error);
    }
};

const createFaculty = async (req, res, next) => {
    try {
        const data = await facultiesService.createFaculty(req.body);
        return successResponse(res, 201, 'Faculty created successfully', data);
    } catch (error) {
        next(error);
    }
};

const deleteFaculty = async (req, res, next) => {
    try {
        await facultiesService.deleteFaculty(req.params.id);
        return successResponse(res, 200, 'Faculty deleted successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getFaculties,
    getAllFaculties: getFaculties,
    getFacultyById,
    createFaculty,
    deleteFaculty
};