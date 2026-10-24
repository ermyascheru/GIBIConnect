const Joi = require('joi');

const createInstitutionSchema = Joi.object({
  name: Joi.string().trim().max(255).required(),
  slug: Joi.string().trim().max(255).optional(),
  description: Joi.string().allow('', null).optional(),
  history: Joi.string().allow('', null).optional(),
  type: Joi.string().valid('university', 'college').required(),
  ownership: Joi.string().valid('public', 'private').required(),
  logo_url: Joi.string().uri().allow('', null).optional(),
  cover_image_url: Joi.string().uri().allow('', null).optional(),
  website_url: Joi.string().uri().allow('', null).optional(),
  email: Joi.string().email().allow('', null).optional(),
  phone: Joi.string().max(50).allow('', null).optional(),
  address: Joi.string().max(255).allow('', null).optional(),
  city: Joi.string().trim().max(120).required(),
  region: Joi.string().trim().max(120).required(),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional(),
  accreditation: Joi.string().max(255).allow('', null).optional(),
  status: Joi.string().valid('draft', 'published', 'archived').default('draft')
});

const updateInstitutionSchema = createInstitutionSchema.fork(
  ['name', 'type', 'ownership', 'city', 'region'],
  (schema) => schema.optional()
);

module.exports = {
  createInstitutionSchema,
  updateInstitutionSchema
};
