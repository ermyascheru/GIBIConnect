const Joi = require('joi');

const createCalendarSchema = Joi.object({
  institution_id: Joi.string().uuid().required(),
  title: Joi.string().trim().max(255).required(),
  event_type: Joi.string().valid('registration', 'semester_start', 'semester_end', 'examination', 'holiday', 'other').required(),
  start_date: Joi.date().iso().required(),
  end_date: Joi.date().iso().allow(null).optional(),
  description: Joi.string().allow('', null).optional()
});

const updateCalendarSchema = createCalendarSchema.fork(
  ['institution_id', 'title', 'event_type', 'start_date'],
  (schema) => schema.optional()
);

module.exports = {
  createCalendarSchema,
  updateCalendarSchema
};
