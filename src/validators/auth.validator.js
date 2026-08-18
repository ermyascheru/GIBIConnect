const Joi = require('joi');

const registerSchema = Joi.object({
    full_name: Joi.string().max(255).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(128).required(),
    role: Joi.string().valid('admin', 'user', 'institution_admin').default('user')
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

module.exports = {
    registerSchema,
    loginSchema
};