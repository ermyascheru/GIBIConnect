const departmentService = require('../services/department.service');

const getDepartments = async (req, res, next) => {
    try {
        const departments = await departmentService.getDepartmentsByFaculty(req.params.facultyId);
        return res.status(200).json({ data: departments, meta: { totalCount: departments.length, timestamp: new Date().toISOString() } });
    } catch (error) {
        if (error.statusCode === 404) return res.status(404).json({ data: null, error: { code: 'NOT_FOUND', message: error.message } });
        next(error);
    }
};

const createDepartment = async (req, res, next) => {
    try {
        const department = await departmentService.createDepartment(req.params.facultyId, req.body);
        return res.status(201).json({ data: department, meta: { timestamp: new Date().toISOString() } });
    } catch (error) {
        if (error.statusCode === 404) return res.status(404).json({ data: null, error: { code: 'NOT_FOUND', message: error.message } });
        next(error);
    }
};

module.exports = { getDepartments, createDepartment };