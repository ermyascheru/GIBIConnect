const jwt = require('jsonwebtoken');
const env = require('../config/env');

function authenticate(req, res, next) {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            data: null,
            meta: { timestamp: new Date().toISOString() },
            error: { code: 'UNAUTHORIZED', message: 'Access denied. No token provided.' }
        });
    }
    //Split the string by the space to get JUST the token part
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            data: null,
            meta: { timestamp: new Date().toISOString() },
            error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token.' }
        });
    }
}

module.exports = authenticate;