const Joi = require('joi');

const createProgramSchema = Joi.object({
    institution_id: Joi.string().uuid().required(),
    department_id: Joi.string().uuid().required(),
    name: Joi.string().trim().required(),
    degree_level: Joi.string().trim().required(),
    study_mode: Joi.string().trim().required(),
    slug: Joi.string().trim().allow('', null).optional(),
    duration: Joi.string().trim().allow('', null).optional(),
    description: Joi.string().allow('', null).optional(),
    admission_requirements: Joi.string().allow('', null).optional(),
    status: Joi.string().default('published').optional()
});

const updateProgramSchema = createProgramSchema.fork(
    ['institution_id', 'department_id', 'name', 'degree_level', 'study_mode'],
    (schema) => schema.optional()
);

module.exports = { createProgramSchema, updateProgramSchema };