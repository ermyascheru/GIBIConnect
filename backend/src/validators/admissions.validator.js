const Joi = require('joi');

const createAdmissionSchema = Joi.object({
  institution_id: Joi.string().uuid().required(),
  program_id: Joi.string().uuid().allow(null).optional(),
  degree_level: Joi.string().valid('certificate', 'diploma', 'bachelor', 'master', 'phd').required(),
  requirements: Joi.string().allow('', null).optional(),
  documents: Joi.string().allow('', null).optional(),
  application_process: Joi.string().allow('', null).optional(),
  application_start: Joi.date().iso().allow(null).optional(),
  application_end: Joi.date().iso().allow(null).optional(),
  application_url: Joi.string().uri().allow('', null).optional()
});

const updateAdmissionSchema = createAdmissionSchema.fork(
  ['institution_id', 'degree_level'],
  (schema) => schema.optional()
);

module.exports = {
  createAdmissionSchema,
  updateAdmissionSchema
};
