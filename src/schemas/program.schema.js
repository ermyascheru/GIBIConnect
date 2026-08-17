const Joi = require('joi');

const createProgramSchema = Joi.object({
    institution_id: Joi.string().uuid().optional(),
    name: Joi.string().max(255).required(),
    slug: Joi.string().max(255).required(),
    description: Joi.string().allow('', null),
    degree_level: Joi.string()
        .valid('certificate', 'diploma', 'bachelor', 'master', 'phd')
        .required(),
    study_mode: Joi.string()
        .valid('full_time', 'part_time', 'online', 'hybrid')
        .allow(null),
    duration: Joi.string().max(100).allow('', null),
    admission_requirements: Joi.string().allow('', null),
    status: Joi.string().valid('draft', 'published', 'archived').default('draft')
});

module.exports = { createProgramSchema };