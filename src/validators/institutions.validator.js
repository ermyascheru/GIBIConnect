const Joi = require('joi');

const createInstitutionSchema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    code: Joi.string().max(50).optional(),
    slug: Joi.string().max(255).optional(),
    type: Joi.string().valid('college', 'university').default('university'),
    ownership: Joi.string().valid('public', 'private').default('public'),
    city: Joi.string().default('Addis Ababa'),
    region: Joi.string().default('Addis Ababa'),
    description: Joi.string().allow('', null).optional(),
    history: Joi.string().allow('', null).optional(),
    website_url: Joi.string().uri().allow('', null).optional(),
    logo_url: Joi.string().uri().allow('', null).optional(),
    cover_image_url: Joi.string().uri().allow('', null).optional(),
    email: Joi.string().email().allow('', null).optional(),
    phone: Joi.string().allow('', null).optional(),
    address: Joi.string().allow('', null).optional(),
    accreditation: Joi.string().allow('', null).optional(),
    status: Joi.string().valid('draft', 'published', 'archived').default('published')
});

module.exports = {
    createInstitutionSchema,
    institutionSchema: createInstitutionSchema
};
