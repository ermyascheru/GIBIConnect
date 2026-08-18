const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-env';

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            data: null,
            error: { code: 'UNAUTHORIZED', message: 'Access token missing or invalid format.' }
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            data: null,
            error: { code: 'UNAUTHORIZED', message: 'Token is invalid or expired.' }
        });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                data: null,
                error: { code: 'FORBIDDEN', message: 'You do not have permission to perform this action.' }
            });
        }
        next();
    };
};

module.exports = {
    authenticate,
    authorize
};