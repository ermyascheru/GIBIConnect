const Joi = require("joi");

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid("guest", "user", "moderator", "admin").default("user")
});

module.exports = { registerSchema };
