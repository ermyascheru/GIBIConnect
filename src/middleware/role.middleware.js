function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
            });
        }

        const userRole = req.user.role || 'user';

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: { code: 'FORBIDDEN', message: 'Forbidden: Insufficient permissions' }
            });
        }

        next();
    };
}

module.exports = { requireRole };
