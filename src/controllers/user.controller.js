const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/user.repository');
const env = require('../config/env');

async function register(req, res, next) {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await userRepo.findUserByEmail(email);

        if (existingUser) {
            return res.status(409).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: { code: 'EMAIL_IN_USE', message: 'A user with this email already exists' }
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUserData = {
            name: name,
            email: email,
            password: hashedPassword,
            role: role || 'user'
        };

        const createdUser = await userRepo.createUser(newUserData);

        res.status(201).json({
            data: createdUser,
            meta: { timestamp: new Date().toISOString() },
            error: null
        });
    } catch (error) {
        next(error);
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        const user = await userRepo.findUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: { code: 'UNAUTHORIZED', message: 'Invalid email or password' }
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: { code: 'UNAUTHORIZED', message: 'Invalid email or password' }
            });
        }

        const userProfile = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            created_at: user.created_at
        };

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            env.JWT_SECRET,
            { expiresIn: env.JWT_EXPIRES_IN }
        );

        res.status(200).json({
            data: {
                user: userProfile,
                token: token
            },
            meta: { timestamp: new Date().toISOString() },
            error: null
        });
    } catch (error) {
        next(error);
    }
}

async function getMe(req, res, next) {
    try {
        const user = await userRepo.findUserById(req.user.id);
        if (!user) {
            return res.status(404).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: { code: 'NOT_FOUND', message: 'User not found' }
            });
        }

        res.status(200).json({
            data: user,
            meta: { timestamp: new Date().toISOString() },
            error: null
        });
    } catch (error) {
        next(error);
    }
}

async function getAdminData(req, res, next) {
    try {
        res.status(200).json({
            data: {
                message: 'Welcome to the Admin Dashboard',
                user: req.user
            },
            meta: { timestamp: new Date().toISOString() },
            error: null
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    register,
    login,
    getMe,
    getAdminData
};