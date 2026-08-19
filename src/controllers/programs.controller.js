const programsService = require('../services/programs.service');
const { successResponse } = require('../utils/response');

const getPrograms = async (req, res, next) => {
    try {
        const data = await programsService.getAllPrograms(req.query);
        return successResponse(res, 200, 'Programs retrieved successfully', data);
    } catch (error) {
        next(error);
    }
};

const getProgramById = async (req, res, next) => {
    try {
        const data = await programsService.getProgramById(req.params.id);
        return successResponse(res, 200, 'Program details retrieved', data);
    } catch (error) {
        next(error);
    }
};

const createProgram = async (req, res, next) => {
    try {
        const departmentId = req.body.department_id || req.body.departmentId || req.params.departmentId;
        const data = await programsService.createProgram(departmentId, req.body);
        return successResponse(res, 201, 'Program created successfully', data);
    } catch (error) {
        next(error);
    }
};

const deleteProgram = async (req, res, next) => {
    try {
        await programsService.deleteProgram(req.params.id);
        return successResponse(res, 200, 'Program deleted successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getPrograms,
    getAllPrograms: getPrograms,
    getProgramById,
    createProgram,
    deleteProgram
};
