const programService = require('../services/program.service');


const getAllPrograms = async (req, res, next) => {
    try {
        const { page, limit, q, degree_level, study_mode, status, institution_id, department_id } = req.query;

        const result = await programService.getAllPrograms({
            page: parseInt(page, 10) || 1,
            limit: parseInt(limit, 10) || 10,
            q,
            degree_level,
            study_mode,
            status,
            institution_id,
            department_id
        });

        return res.status(200).json({
            data: result.rows,
            meta: {
                page: result.page,
                limit: result.limit,
                totalCount: result.totalCount,
                totalPages: result.totalPages,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        if (error.code === '22P02') {
            return res.status(400).json({
                data: null,
                error: { code: 'INVALID_ID', message: 'Invalid UUID format provided in query filters.' }
            });
        }
        next(error);
    }
};

const getPrograms = async (req, res, next) => {
    try {
        const programs = await programService.getProgramsByDepartment(req.params.departmentId);
        return res.status(200).json({
            data: programs,
            meta: { totalCount: programs.length, timestamp: new Date().toISOString() }
        });
    } catch (error) {
        if (error.code === '22P02') {
            return res.status(400).json({ data: null, error: { code: 'INVALID_ID', message: 'Invalid ID format.' } });
        }
        next(error);
    }
};

const getProgramById = async (req, res, next) => {
    try {
        const program = await programService.getProgramById(req.params.id);
        return res.status(200).json({
            data: program,
            meta: { timestamp: new Date().toISOString() }
        });
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({ data: null, error: { code: 'NOT_FOUND', message: error.message } });
        }
        if (error.code === '22P02') {
            return res.status(400).json({ data: null, error: { code: 'INVALID_ID', message: 'Invalid ID format.' } });
        }
        next(error);
    }
};

const createProgram = async (req, res, next) => {
    try {
        const program = await programService.createProgram(req.params.departmentId, req.body);
        return res.status(201).json({
            data: program,
            meta: { timestamp: new Date().toISOString() }
        });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({
                data: null,
                error: { code: 'DUPLICATE_SLUG', message: 'A program with this slug already exists.' }
            });
        }
        if (error.statusCode === 404) {
            return res.status(404).json({
                data: null,
                error: { code: 'NOT_FOUND', message: error.message }
            });
        }
        next(error);
    }
};

const deleteProgram = async (req, res, next) => {
    try {
        await programService.deleteProgram(req.params.id);
        return res.status(200).json({
            data: { message: 'Program deleted successfully' },
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
    getAllPrograms,
    getPrograms,
    getProgramById,
    createProgram,
    deleteProgram
};