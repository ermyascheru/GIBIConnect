const Joi = require('joi');

const savedInstitutionSchema = Joi.object({
    institution_id: Joi.number().integer().required()
});

module.exports = { savedInstitutionSchema };