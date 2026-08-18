const departmentsService = require('../services/departments.service');
const { successResponse } = require('../utils/response');

const getDepartments = async (req, res, next) => {
    try {
        const data = await departmentsService.getAllDepartments(req.query);
        return successResponse(res, 200, 'Departments retrieved successfully', data);
    } catch (error) {
        next(error);
    }
};

const getDepartmentById = async (req, res, next) => {
    try {
        const data = await departmentsService.getDepartmentById(req.params.id);
        if (!data) {
            const err = new Error('Department not found');
            err.statusCode = 404;
            throw err;
        }
        return successResponse(res, 200, 'Department details retrieved', data);
    } catch (error) {
        next(error);
    }
};

const createDepartment = async (req, res, next) => {
    try {
        const data = await departmentsService.createDepartment(req.body);
        return successResponse(res, 201, 'Department created successfully', data);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDepartments,
    getAllDepartments: getDepartments,
    getDepartmentById,
    createDepartment
};