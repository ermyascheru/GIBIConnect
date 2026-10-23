const Joi = require('joi');

const scholarshipSchema = Joi.object({
    institution_id: Joi.number().integer().required(),
    title: Joi.string().min(3).max(255).required(),
    amount: Joi.number().precision(2).positive().optional(),
    eligibility_criteria: Joi.string().allow('', null).optional(),
    deadline: Joi.date().iso().optional()
});

module.exports = { scholarshipSchema };