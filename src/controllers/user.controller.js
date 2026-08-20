const bcrypt = require('bcrypt');
const userRepo = require('../repositories/user.repository');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;

        const existingUser = await userRepo.findUserByEmail(email);

        if (existingUser) {
            return res.status(400).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: { code: 'EMAIL_IN_USE', message: 'A user with this email already exists' }
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUserData = {
            name: name,
            email: email,
            password: hashedPassword
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

        delete user.password;

        const token = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

        res.status(200).json({
            data: {
                user: user,
                token: token
            },
            meta: { timestamp: new Date().toISOString() },
            error: null
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { register, login };