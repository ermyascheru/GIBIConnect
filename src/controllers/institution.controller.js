const Joi = require('joi');
const institutionService = require('../services/institution.service');
const { createInstitutionSchema, updateInstitutionSchema } = require('../schemas/institution.schema');
const institutionRepository = require('../repositories/institution.repository');

const uuidSchema = Joi.string().uuid().required();

const getAll = async (req, res, next) => {
    try {
        const institutions = await institutionService.getAllInstitutions();
        return res.status(200).json({
            data: institutions,
            meta: { timestamp: new Date().toISOString() },
            error: null
        });
    } catch (err) {
        next(err);
    }
};

const getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { error: idError } = uuidSchema.validate(id);
        if (idError) {
            return res.status(400).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: 'Invalid institution UUID format'
            });
        }

        const institution = await institutionService.getInstitutionById(id);
        if (!institution) {
            return res.status(404).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: 'Institution not found'
            });
        }

        return res.status(200).json({
            data: institution,
            meta: { timestamp: new Date().toISOString() },
            error: null
        });
    } catch (err) {
        next(err);
    }
};

const create = async (req, res, next) => {
    try {
        // 1. Check if slug exists in DB before inserting
        const existingInstitution = await institutionRepository.findBySlug(req.body.slug);
        if (existingInstitution) {
            return res.status(409).json({
                data: null,
                error: {
                    code: 'DUPLICATE_SLUG',
                    message: 'An institution with this slug already exists.'
                }
            });
        }

        // 2. Proceed to create
        const institution = await institutionRepository.create(req.body);
        return res.status(201).json({ data: institution });

    } catch (error) {
        // 3. Fallback check for Postgres unique violation constraint (code 23505)
        if (error.code === '23505' && error.constraint === 'institutions_slug_key') {
            return res.status(409).json({
                data: null,
                error: {
                    code: 'DUPLICATE_SLUG',
                    message: 'An institution with this slug already exists.'
                }
            });
        }
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { error: idError } = uuidSchema.validate(id);
        if (idError) {
            return res.status(400).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: 'Invalid institution UUID format'
            });
        }

        const { error, value } = updateInstitutionSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: error.details[0].message
            });
        }

        const updated = await institutionService.updateInstitution(id, value);
        if (!updated) {
            return res.status(404).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: 'Institution not found'
            });
        }

        return res.status(200).json({
            data: updated,
            meta: { timestamp: new Date().toISOString() },
            error: null
        });
    } catch (err) {
        next(err);
    }
};

const remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { error: idError } = uuidSchema.validate(id);
        if (idError) {
            return res.status(400).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: 'Invalid institution UUID format'
            });
        }

        const deleted = await institutionService.deleteInstitution(id);
        if (!deleted) {
            return res.status(404).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: 'Institution not found'
            });
        }

        return res.status(200).json({
            data: deleted,
            meta: { timestamp: new Date().toISOString() },
            error: null
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { getAll, getById, create, update, remove };