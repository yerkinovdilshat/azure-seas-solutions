import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies[process.env.SESSION_COOKIE_NAME || 'ms_session'];
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, role: true }
        });
        if (!user) {
            return res.status(401).json({ error: 'Invalid session' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
export const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        next();
    };
};
//# sourceMappingURL=auth.js.map