const facultyService = require('../services/faculties.service');

const getFaculties = async (req, res, next) => {
    try {
        const faculties = await facultyService.getFacultiesByInstitution(req.params.institutionId);
        return res.status(200).json({
            data: faculties,
            meta: { totalCount: faculties.length, timestamp: new Date().toISOString() }
        });
    } catch (error) {
        // Catch invalid UUID format from PostgreSQL
        if (error.code === '22P02') {
            return res.status(400).json({
                data: null,
                error: { code: 'INVALID_ID', message: 'Invalid institution ID format. Must be a valid UUID.' }
            });
        }
        if (error.statusCode === 404) {
            return res.status(404).json({ data: null, error: { code: 'NOT_FOUND', message: error.message } });
        }
        next(error);
    }
};

const createFaculty = async (req, res, next) => {
    try {
        const faculty = await facultyService.createFaculty(req.params.institutionId, req.body);
        return res.status(201).json({
            data: faculty,
            meta: { timestamp: new Date().toISOString() }
        });
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({ data: null, error: { code: 'NOT_FOUND', message: error.message } });
        }
        next(error);
    }
};

const deleteFaculty = async (req, res, next) => {
    try {
        await facultyService.deleteFaculty(req.params.id);
        return res.status(200).json({
            data: { message: 'Faculty deleted successfully' },
            meta: { timestamp: new Date().toISOString() }
        });
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({ data: null, error: { code: 'NOT_FOUND', message: error.message } });
        }
        next(error);
    }
};

module.exports = {
    getFaculties,
    createFaculty,
    deleteFaculty
};