const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/users.repository');
const env = require('../config/env');

const register = async ({ full_name, email, password, role }) => {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
        const error = new Error('Email is already registered.');
        error.statusCode = 409;
        throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const user = await userRepository.create({ full_name, email, password_hash, role });
    const token = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN || '1d' });

    return { user, token };
};

const login = async ({ email, password }) => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
        const error = new Error('Invalid email or password.');
        error.statusCode = 401;
        throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        const error = new Error('Invalid email or password.');
        error.statusCode = 401;
        throw error;
    }

    const token = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN || '1d' });

    delete user.password_hash;
    return { user, token };
};

const getUserById = async (id) => {
    const user = await userRepository.findById(id);
    if (!user) {
        const error = new Error('User not found.');
        error.statusCode = 404;
        throw error;
    }
    delete user.password_hash;
    return user;
};

module.exports = { register, login, getUserById };
