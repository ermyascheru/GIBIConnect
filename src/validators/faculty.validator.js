const Joi = require('joi');

const createFacultySchema = Joi.object({
    name: Joi.string().max(255).required(),
    description: Joi.string().allow('', null)
});

module.exports = { createFacultySchema };