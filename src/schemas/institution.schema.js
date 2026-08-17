const Joi = require('joi');

const createInstitutionSchema = Joi.object({
    name: Joi.string().trim().required(),
    slug: Joi.string().trim().required(),
    type: Joi.string().valid('university', 'college').required(),
    ownership: Joi.string().valid('public', 'private').required(),
    city: Joi.string().trim().required(),
    region: Joi.string().trim().required(),
    description: Joi.string().allow('', null).optional(),
    history: Joi.string().allow('', null).optional(),
    logo_url: Joi.string().uri().allow('', null).optional(),
    cover_image_url: Joi.string().uri().allow('', null).optional(),
    website_url: Joi.string().uri().allow('', null).optional(),
    email: Joi.string().email().allow('', null).optional(),
    phone: Joi.string().allow('', null).optional(),
    address: Joi.string().allow('', null).optional(),
    latitude: Joi.number().min(-90).max(90).allow(null).optional(),
    longitude: Joi.number().min(-180).max(180).allow(null).optional(),
    accreditation: Joi.string().allow('', null).optional(),
    status: Joi.string().valid('draft', 'published', 'archived').default('draft').optional()
});

const updateInstitutionSchema = createInstitutionSchema.fork(
    ['name', 'slug', 'type', 'ownership', 'city', 'region'],
    (schema) => schema.optional()
);

module.exports = { createInstitutionSchema, updateInstitutionSchema };