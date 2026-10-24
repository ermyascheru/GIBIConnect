const Joi = require('joi');

const institutionSchema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    type: Joi.string().valid('Public', 'Private').optional(),
    description: Joi.string().optional()
});

module.exports = { institutionSchema };