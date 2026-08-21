function normalizeRoles(allowedRoles) {
    return allowedRoles.flat().filter(Boolean);
}

function authorizeRoles(...allowedRoles) {
    const roles = normalizeRoles(allowedRoles);

    if (roles.length === 0) {
        throw new Error('authorizeRoles requires at least one role.');
    }

    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: { code: 'UNAUTHORIZED', message: 'Access denied. Please authenticate first.' }
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: {
                    code: 'FORBIDDEN',
                    message: `Access denied. Requires one of the following roles: ${roles.join(', ')}.`
                }
            });
        }

        next();
    };
}

module.exports = authorizeRoles;
module.exports.authorizeRoles = authorizeRoles;
