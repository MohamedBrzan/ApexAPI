import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { logger } from './logging.js';

/**
 * Middleware to verify if the user is authenticated.
 * Validates the presence and integrity of the JWT token.
 */
export default (options = {}) => async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token && options.optional) return next();
    if (!token) return res.status(401).json({ error: 'Authentication required' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.sub)
            .select('+roles +active')
            .lean();

        if (!user?.active) {
            throw new Error('User not found or inactive');
        }

        req.user = {
            id: user._id,
            roles: user.roles,
            organization: user.organization
        };

        next();
    } catch (error) {
        logger.error('Authentication error:', error.message);

        const response = error.name === 'TokenExpiredError'
            ? { error: 'Token expired', code: 'TOKEN_EXPIRED' }
            : { error: 'Invalid token', code: 'INVALID_TOKEN' };

        res.status(401).json(response);
    }
};