const Joi = require('joi');

const facilitySchema = Joi.object({
    institution_id: Joi.number().integer().required(),
    name: Joi.string().min(3).max(255).required(),
    category: Joi.string().max(100).allow('', null).optional(),
    description: Joi.string().allow('', null).optional()
});

module.exports = { facilitySchema };