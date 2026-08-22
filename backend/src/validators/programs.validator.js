const Joi = require('joi');

const createProgramSchema = Joi.object({
  institution_id: Joi.string().uuid().required(),
  department_id: Joi.string().uuid().required(),
  name: Joi.string().trim().max(255).required(),
  slug: Joi.string().trim().max(255).optional(),
  degree_level: Joi.string().valid('certificate', 'diploma', 'bachelor', 'master', 'phd').required(),
  duration: Joi.string().max(50).allow('', null).optional(),
  study_mode: Joi.string().valid('full_time', 'part_time', 'online', 'hybrid').required(),
  description: Joi.string().allow('', null).optional(),
  admission_requirements: Joi.string().allow('', null).optional(),
  status: Joi.string().valid('draft', 'published', 'archived').default('draft')
});

const updateProgramSchema = createProgramSchema.fork(
  ['institution_id', 'department_id', 'name', 'degree_level', 'study_mode'],
  (schema) => schema.optional()
);

module.exports = {
  createProgramSchema,
  updateProgramSchema
};
