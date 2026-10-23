const Joi = require('joi');

const createScholarshipSchema = Joi.object({
  name: Joi.string().trim().max(255).required(),
  slug: Joi.string().trim().max(255).optional(),
  description: Joi.string().allow('', null).optional(),
  eligibility: Joi.string().allow('', null).optional(),
  deadline: Joi.date().iso().allow(null).optional(),
  funding: Joi.string().max(255).allow('', null).optional(),
  application_url: Joi.string().uri().allow('', null).optional(),
  status: Joi.string().valid('draft', 'published', 'archived').default('draft'),
  institution_ids: Joi.array().items(Joi.string().uuid()).optional()
});

const updateScholarshipSchema = createScholarshipSchema.fork(
  ['name'],
  (schema) => schema.optional()
);

module.exports = {
  createScholarshipSchema,
  updateScholarshipSchema
};
