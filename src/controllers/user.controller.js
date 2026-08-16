const bcrypt = require('bcrypt');
const userRepo = require('../repositories/user.repository');

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

module.exports = {register};