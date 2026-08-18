const authService = require('../services/auth.service');
const { successResponse } = require('../utils/response');

const register = async (req, res, next) => {
    try {
        const user = await authService.register(req.body);
        return successResponse(res, 201, 'User registered successfully', user);
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);
        return successResponse(res, 200, 'Login successful', result);
    } catch (error) {
        next(error);
    }
};

const getCurrentUser = async (req, res, next) => {
    try {
        const user = await authService.getUserById(req.user.id);
        return successResponse(res, 200, 'Current user retrieved successfully', user);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getCurrentUser
};