const facultiesService = require('../services/faculties.service');
const { successResponse } = require('../utils/response');

const getFaculties = async (req, res, next) => {
    try {
        const targetId = req.query.institutionId || req.query.institution_id || req.params.institutionId;
        const id = typeof targetId === 'string' && targetId.trim() ? targetId : null;
        const data = id ? await facultiesService.getFacultiesByInstitution(id) : [];
        return successResponse(res, 200, 'Faculties retrieved successfully', data);
    } catch (error) {
        next(error);
    }
};

const createFaculty = async (req, res, next) => {
    try {
        const institutionId = req.body.institution_id || req.body.institutionId || req.params.institutionId;
        const data = await facultiesService.createFaculty(institutionId, req.body);
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
    getFacultyById: getFaculties,
    createFaculty,
    deleteFaculty
};
