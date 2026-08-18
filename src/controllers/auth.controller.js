const authService = require('../services/auth.service');
const { registerSchema, loginSchema } = require('../schemas/auth.schema');

const register = async (req, res, next) => {
    try {
        const { error, value } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                data: null,
                error: { code: 'VALIDATION_ERROR', message: error.details[0].message }
            });
        }

        const result = await authService.register(value);
        return res.status(201).json({
            data: result,
            meta: { timestamp: new Date().toISOString() }
        });
    } catch (error) {
        if (error.statusCode === 409) {
            return res.status(409).json({
                data: null,
                error: { code: 'EMAIL_EXISTS', message: error.message }
            });
        }
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                data: null,
                error: { code: 'VALIDATION_ERROR', message: error.details[0].message }
            });
        }

        const result = await authService.login(value);
        return res.status(200).json({
            data: result,
            meta: { timestamp: new Date().toISOString() }
        });
    } catch (error) {
        if (error.statusCode === 401) {
            return res.status(401).json({
                data: null,
                error: { code: 'UNAUTHORIZED', message: error.message }
            });
        }
        next(error);
    }
};

module.exports = {
    register,
    login
};