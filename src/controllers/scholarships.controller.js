const Joi = require('joi');
const scholarshipService = require('../services/scholarship.service');
const { createScholarshipSchema, updateScholarshipSchema } = require('../schemas/scholarship.schema');

const uuidSchema = Joi.string().uuid().required();

const getAll = async (req, res, next) => {
    try {
        const scholarships = await scholarshipService.getAllScholarships();
        return res.status(200).json({ data: scholarships, meta: { timestamp: new Date().toISOString() }, error: null });
    } catch (err) {
        next(err);
    }
};

const getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { error: idError } = uuidSchema.validate(id);
        if (idError) {
            return res.status(400).json({ data: null, meta: { timestamp: new Date().toISOString() }, error: 'Invalid scholarship UUID' });
        }
        const scholarship = await scholarshipService.getScholarshipById(id);
        if (!scholarship) {
            return res.status(404).json({ data: null, meta: { timestamp: new Date().toISOString() }, error: 'Scholarship not found' });
        }
        return res.status(200).json({ data: scholarship, meta: { timestamp: new Date().toISOString() }, error: null });
    } catch (err) {
        next(err);
    }
};

const create = async (req, res, next) => {
    try {
        const { error, value } = createScholarshipSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ data: null, meta: { timestamp: new Date().toISOString() }, error: error.details[0].message });
        }
        const newScholarship = await scholarshipService.createScholarship(value);
        return res.status(201).json({ data: newScholarship, meta: { timestamp: new Date().toISOString() }, error: null });
    } catch (err) {
        next(err);
    }
};

const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { error: idError } = uuidSchema.validate(id);
        if (idError) {
            return res.status(400).json({ data: null, meta: { timestamp: new Date().toISOString() }, error: 'Invalid scholarship UUID' });
        }

        const { error, value } = updateScholarshipSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ data: null, meta: { timestamp: new Date().toISOString() }, error: error.details[0].message });
        }

        const updated = await scholarshipService.updateScholarship(id, value);
        if (!updated) {
            return res.status(404).json({ data: null, meta: { timestamp: new Date().toISOString() }, error: 'Scholarship not found' });
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
            return res.status(400).json({ data: null, meta: { timestamp: new Date().toISOString() }, error: 'Invalid scholarship UUID' });
        }

        const deleted = await scholarshipService.deleteScholarship(id);
        if (!deleted) {
            return res.status(404).json({ data: null, meta: { timestamp: new Date().toISOString() }, error: 'Scholarship not found' });
        }

        return res.status(200).json({ data: deleted, meta: { timestamp: new Date().toISOString() }, error: null });
    } catch (err) {
        next(err);
    }
};

module.exports = { getAll, getById, create, update, remove };