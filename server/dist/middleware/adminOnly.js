import jwt from 'jsonwebtoken';
import { getConfig } from '../config.js';
import { prisma } from '../lib/prisma.js';
const config = getConfig();
export const adminOnly = async (req, res, next) => {
    try {
        const token = req.cookies[config.SESSION_COOKIE_NAME];
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, role: true }
        });
        if (!user) {
            return res.status(401).json({ error: 'Invalid session' });
        }
        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
//# sourceMappingURL=adminOnly.js.map