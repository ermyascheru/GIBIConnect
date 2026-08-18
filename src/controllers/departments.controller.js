const departmentsService = require('../services/departments.service');
const { successResponse } = require('../utils/response');

const getDepartments = async (req, res, next) => {
    try {
        const targetId = req.query.facultyId || req.query.faculty_id || req.params.facultyId;
        const id = typeof targetId === 'string' && targetId.trim() ? targetId : null;
        const data = id ? await departmentsService.getDepartmentsByFaculty(id) : [];
        return successResponse(res, 200, 'Departments retrieved successfully', data);
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
    getDepartmentById: getDepartments,
    createDepartment
};