const Joi = require('joi');

const createReviewSchema = Joi.object({
  institution_id: Joi.string().uuid().required(),
  teaching_rating: Joi.number().integer().min(1).max(5).required(),
  facility_rating: Joi.number().integer().min(1).max(5).required(),
  campus_rating: Joi.number().integer().min(1).max(5).required(),
  administration_rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().allow('', null).optional()
});

module.exports = {
  createReviewSchema
};
