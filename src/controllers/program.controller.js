const Joi = require('joi');
const programService = require('../services/program.service');
const { createProgramSchema, updateProgramSchema } = require('../schemas/program.schema');

const uuidSchema = Joi.string().uuid().required();

const getByInstitution = async (req, res, next) => {
    try {
        const { institutionId } = req.params;
        const { error: idError } = uuidSchema.validate(institutionId);
        if (idError) {
            return res.status(400).json({ data: null, meta: { timestamp: new Date().toISOString() }, error: 'Invalid institution UUID' });
        }
        const programs = await programService.getProgramsByInstitution(institutionId);
        return res.status(200).json({ data: programs, meta: { timestamp: new Date().toISOString() }, error: null });
    } catch (err) {
        next(err);
    }
};

const getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { error: idError } = uuidSchema.validate(id);
        if (idError) {
            return res.status(400).json({ data: null, meta: { timestamp: new Date().toISOString() }, error: 'Invalid program UUID' });
        }
        const program = await programService.getProgramById(id);
        if (!program) {
            return res.status(404).json({ data: null, meta: { timestamp: new Date().toISOString() }, error: 'Program not found' });
        }
        return res.status(200).json({ data: program, meta: { timestamp: new Date().toISOString() }, error: null });
    } catch (err) {
        next(err);
    }
};

const create = async (req, res, next) => {
    try {
        const { error, value } = createProgramSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ data: null, meta: { timestamp: new Date().toISOString() }, error: error.details[0].message });
        }
        const newProgram = await programService.createProgram(value);
        return res.status(201).json({ data: newProgram, meta: { timestamp: new Date().toISOString() }, error: null });
    } catch (err) {
        next(err);
    }
};

const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { error: idError } = uuidSchema.validate(id);
        if (idError) {
            return res.status(400).json({ data: null, meta: { timestamp: new Date().toISOString() }, error: 'Invalid program UUID' });
        }

        const { error, value } = updateProgramSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ data: null, meta: { timestamp: new Date().toISOString() }, error: error.details[0].message });
        }

        const updated = await programService.updateProgram(id, value);
        if (!updated) {
            return res.status(404).json({ data: null, meta: { timestamp: new Date().toISOString() }, error: 'Program not found' });
        }

        return res.status(200).json({ data: updated, meta: { timestamp: new Date().toISOString() }, error: null });
    } catch (err) {
        next(err);
    }
};

const remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { error: idError } = uuidSchema.validate(id);
        if (idError) {
            return res.status(400).json({ data: null, meta: { timestamp: new Date().toISOString() }, error: 'Invalid program UUID' });
        }

        const deleted = await programService.deleteProgram(id);
        if (!deleted) {
            return res.status(404).json({ data: null, meta: { timestamp: new Date().toISOString() }, error: 'Program not found' });
        }

        return res.status(200).json({ data: deleted, meta: { timestamp: new Date().toISOString() }, error: null });
    } catch (err) {
        next(err);
    }
};

module.exports = { getByInstitution, getById, create, update, remove };