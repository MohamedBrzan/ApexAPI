export const roleMiddleware = (allowedRoles = []) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const userRoles = Array.isArray(req.user.roles) ? req.user.roles : [req.user.roles];
    const hasPermission = allowedRoles.some(role => userRoles.includes(role));

    if (!hasPermission) {
        return res.status(403).json({
            error: 'Forbidden',
            message: 'Insufficient permissions'
        });
    }

    next();
};