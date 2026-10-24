const Joi = require('joi');

const registerSchema = Joi.object({
  full_name: Joi.string().trim().max(150).required(),
  email: Joi.string().trim().email({ tlds: { allow: false } }).max(255).required(),
  password: Joi.string().min(8).max(128).required(),
  role: Joi.string().valid('user', 'moderator', 'admin').default('user')
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email({ tlds: { allow: false } }).required(),
  password: Joi.string().required()
});

module.exports = {
  registerSchema,
  loginSchema
};
