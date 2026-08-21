const jwt = require('jsonwebtoken');
const env = require('../config/env');

function extractToken(req) {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    return authHeader.split(' ')[1];
}

function unauthorized(res, message) {
    return res.status(401).json({
        data: null,
        meta: { timestamp: new Date().toISOString() },
        error: { code: 'UNAUTHORIZED', message }
    });
}

function authenticate(req, res, next) {
    const token = extractToken(req);

    if (!token) {
        return unauthorized(res, 'Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return unauthorized(res, 'Your session has expired. Please log in again.');
        }

        return unauthorized(res, 'Invalid or expired token.');
    }
}

function optionalAuthenticate(req, res, next) {
    const token = extractToken(req);

    if (!token) {
        return next();
    }

    try {
        req.user = jwt.verify(token, env.JWT_SECRET);
    } catch (error) {
        req.user = undefined;
    }

    next();
}

module.exports = authenticate;
module.exports.authenticate = authenticate;
module.exports.optionalAuthenticate = optionalAuthenticate;
