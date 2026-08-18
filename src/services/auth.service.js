const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/users.repository');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-env';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

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
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

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

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    delete user.password_hash;
    return { user, token };
};

module.exports = {
    register,
    login
};