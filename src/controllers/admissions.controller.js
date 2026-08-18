const admissionsService = require('../services/admissions.service');
const { successResponse } = require('../utils/response');

const getAdmissions = async (req, res, next) => {
    try {
        const targetId = req.query.institutionId || req.query.institution_id || req.params.institutionId;
        const id = typeof targetId === 'string' && targetId.trim() ? targetId : null;
        const data = id ? await admissionsService.getAdmissionsByInstitution(id) : [];
        return successResponse(res, 200, 'Admissions retrieved successfully', data);
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
    getAdmissionById: getAdmissions,
    createAdmission
};