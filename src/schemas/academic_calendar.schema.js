const Joi = require('joi');

const academicCalendarSchema = Joi.object({
    institution_id: Joi.number().integer().required(),
    title: Joi.string().min(3).max(255).required(),
    event_type: Joi.string().max(100).allow('', null).optional(),
    start_date: Joi.date().iso().required(),
    end_date: Joi.date().iso().allow('', null).optional(),
    description: Joi.string().allow('', null).optional()
});

module.exports = { academicCalendarSchema };