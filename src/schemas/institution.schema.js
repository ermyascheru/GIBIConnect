const Joi = require('joi');

const createInstitutionSchema = Joi.object({
    name: Joi.string().max(255).required(),
    slug: Joi.string().max(255).required(),
    description: Joi.string().allow('', null),
    history: Joi.string().allow('', null),
    type: Joi.string().valid('university', 'college').required(),
    ownership: Joi.string().valid('public', 'private').required(),
    logo_url: Joi.string().uri().allow('', null),
    cover_image_url: Joi.string().uri().allow('', null),
    website_url: Joi.string().uri().allow('', null),
    email: Joi.string().email().allow('', null),
    phone: Joi.string().max(50).allow('', null),
    address: Joi.string().max(255).allow('', null),
    city: Joi.string().max(120).required(),
    region: Joi.string().max(120).required(),
    latitude: Joi.number().min(-90).max(90).allow(null),
    longitude: Joi.number().min(-180).max(180).allow(null),
    accreditation: Joi.string().max(255).allow('', null),
    status: Joi.string().valid('draft', 'published', 'archived').default('draft')
});

const updateInstitutionSchema = Joi.object({
    name: Joi.string().max(255),
    slug: Joi.string().max(255),
    description: Joi.string().allow('', null),
    history: Joi.string().allow('', null),
    type: Joi.string().valid('university', 'college'),
    ownership: Joi.string().valid('public', 'private'),
    logo_url: Joi.string().uri().allow('', null),
    cover_image_url: Joi.string().uri().allow('', null),
    website_url: Joi.string().uri().allow('', null),
    email: Joi.string().email().allow('', null),
    phone: Joi.string().max(50).allow('', null),
    address: Joi.string().max(255).allow('', null),
    city: Joi.string().max(120),
    region: Joi.string().max(120),
    latitude: Joi.number().min(-90).max(90).allow(null),
    longitude: Joi.number().min(-180).max(180).allow(null),
    accreditation: Joi.string().max(255).allow('', null),
    status: Joi.string().valid('draft', 'published', 'archived')
}).min(1);

module.exports = {
    createInstitutionSchema,
    updateInstitutionSchema
};