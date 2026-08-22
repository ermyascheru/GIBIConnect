function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: { code: 'FORBIDDEN', message: 'Access denied. Admin privileges required.' }
            });
        }
        
        next();
    };
}

module.exports = authorizeRoles;