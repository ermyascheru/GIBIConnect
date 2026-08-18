const usersService = require('../services/users.service');
const { successResponse } = require('../utils/response');

const getAllUsers = async (req, res, next) => {
    try {
        const users = await usersService.getAllUsers(req.query);
        return successResponse(res, 200, 'Users retrieved successfully', users);
    } catch (error) {
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const user = await usersService.getUserById(req.params.id);
        if (!user) {
            const err = new Error('User not found');
            err.statusCode = 404;
            throw err;
        }
        return successResponse(res, 200, 'User profile retrieved successfully', user);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllUsers,
    getUserById
};