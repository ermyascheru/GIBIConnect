const Joi = require('joi');

const programSchema = Joi.object({
    institution_id: Joi.number().integer().required(),
    name: Joi.string().min(2).max(255).required(),
    degree_level: Joi.string().valid('Bachelor', 'Master', 'PhD', 'Diploma', 'Certificate').required(),
    duration_years: Joi.number().integer().min(1).max(10).optional(),
    description: Joi.string().allow('', null).optional()
});

module.exports = { programSchema };