import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { logger } from './logging.js';

/**
 * Middleware to verify if the user is authenticated.
 * Validates the presence and integrity of the JWT token.
 * Ensure process.env.JWT_SECRET is at least 32 characters for security.
 */
export default (options = {}) => async (req, res, next) => {
    // Validate authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || typeof authHeader !== 'string') {
        if (options.optional) return next();
        return res.status(401).json({ error: 'Authentication required' });
    }

    // Check if header starts with "Bearer " (case-insensitive)
    const token = authHeader.toLowerCase().startsWith('bearer ')
        ? authHeader.slice(7)
        : null;
    if (!token) {
        if (options.optional) return next();
        return res.status(401).json({ error: 'Invalid token format' });
    }

    try {
        // Verify JWT, ensure secret is secure (at least 32 chars recommended)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user, validate sub is a string and not empty
        if (!decoded.sub || typeof decoded.sub !== 'string') {
            throw new Error('Invalid subject claim');
        }

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
        // Log error safely, avoid sensitive data
        logger.error('Authentication error', { type: error.name, code: error.code });

        // Handle JWT-specific errors
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token', code: 'INVALID_TOKEN' });
        }

        // Handle database or other server errors
        logger.error('Server error during authentication', { type: error.name, code: error.code });
        return res.status(500).json({ error: 'Server error', code: 'SERVER_ERROR' });
    }
};