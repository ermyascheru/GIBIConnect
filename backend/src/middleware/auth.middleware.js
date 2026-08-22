const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-token-key-change-in-env';

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'Authentication token missing or invalid');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return errorResponse(res, 401, 'Invalid or expired token', { code: 'TOKEN_INVALID', message: err.message });
  }
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return errorResponse(res, 403, 'Forbidden: Insufficient privileges', {
        code: 'FORBIDDEN',
        requiredRoles: allowedRoles,
        currentRole: req.user ? req.user.role : null
      });
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize
};
