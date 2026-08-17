const Joi = require('joi');

const admissionSchema = Joi.object({
    institution_id: Joi.number().integer().required(),
    min_gpa: Joi.number().min(0.0).max(4.0).allow(null).optional(),
    national_exam_cutoff: Joi.number().integer().min(0).allow(null).optional(),
    requirements_text: Joi.string().required(),
    application_fee: Joi.number().min(0).allow(null).optional()
});

module.exports = { admissionSchema };