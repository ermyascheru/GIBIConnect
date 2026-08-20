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

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            data: null,
            meta: { timestamp: new Date().toISOString() },
            error: { code: 'UNAUTHORIZED', message: 'Access denied. No token provided.' }
        });
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: { code: 'UNAUTHORIZED', message: 'Token expired.' }
            });
        }
        return res.status(401).json({
            data: null,
            meta: { timestamp: new Date().toISOString() },
            error: { code: 'UNAUTHORIZED', message: 'Invalid token.' }
        });
    }
}

module.exports = authenticate;