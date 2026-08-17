const Joi = require('joi');

const reviewSchema = Joi.object({
    institution_id: Joi.number().integer().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().allow('', null).optional()
});

module.exports = { reviewSchema };