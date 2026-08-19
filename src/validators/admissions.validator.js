const Joi = require("joi");

const createSchema = Joi.object({
  name: Joi.string().max(255).optional(),
  title: Joi.string().max(255).optional()
}).unknown(true);

const updateSchema = createSchema;

module.exports = { createSchema, updateSchema };
