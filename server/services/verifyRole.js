const verifyRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user || !requiredRole.includes(req.user.role)) {
            return res.status(403).json({ message: 'Permission denied: You do not have the required role.' });
        }
        next();
    }
}

export default verifyRole;