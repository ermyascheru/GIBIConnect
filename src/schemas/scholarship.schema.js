const Joi = require('joi');

const createScholarshipSchema = Joi.object({
    name: Joi.string().trim().required(),
    slug: Joi.string().trim().allow('', null).optional(),
    description: Joi.string().allow('', null).optional(),
    funding: Joi.string().allow('', null).optional(),
    eligibility: Joi.string().allow('', null).optional(),
    deadline: Joi.date().iso().allow(null).optional(),
    application_url: Joi.string().uri().allow('', null).optional(),
    status: Joi.string().valid('draft', 'published', 'archived').default('published').optional()
});

const updateScholarshipSchema = createScholarshipSchema.fork(
    ['name'],
    (schema) => schema.optional()
);

module.exports = { createScholarshipSchema, updateScholarshipSchema };