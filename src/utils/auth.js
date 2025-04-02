import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import Token from '../models/Token.js';
import { ApiError } from '../middleware/errorMiddleware.js';

// Token service object
const tokenService = {
    /**
     * Generate access and refresh tokens
     * @param {Object} user - User object
     * @returns {Object} Tokens and expiration info
     */
    generateAuthTokens: async (req, user) => {
        try {
            const accessToken = jwt.sign(
                {
                    sub: user._id,
                    role: user.role,
                    org: user.organization
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "7d",
                    algorithm: 'HS256'
                }
            );

            const refreshToken = jwt.sign(
                {
                    sub: user._id,
                    jti: crypto.randomUUID()
                },
                process.env.JWT_REFRESH_SECRET,
                {
                    expiresIn: "7d",
                    algorithm: 'HS256'
                }
            );

            // Store refresh token in database
            await Token.create({
                user: user._id,
                refreshToken,
                expiresAt: new Date(Date.now() + 1000 * 1000),
                userAgent: req.headers['user-agent'],
                ip: req.ip
            });

            return {
                accessToken,
                refreshToken,
                accessExpiresIn: "7d",
                refreshExpiresIn: "7d"
            };
        } catch (error) {
            throw new ApiError(500, 'Token generation failed');
        }
    },

    /**
     * Verify access token
     * @param {string} token - JWT token
     * @returns {Object} Decoded token payload
     */
    verifyAccessToken: (token) => {
        try {
            return jwt.verify(token, process.env.JWT_SECRET, {
                algorithms: ['HS256']
            });
        } catch (error) {
            throw new ApiError(401, 'Invalid access token');
        }
    },

    /**
     * Verify refresh token
     * @param {string} token - JWT token
     * @returns {Object} Decoded token payload
     */
    verifyRefreshToken: async (token) => {
        try {
            const decoded = jwt.verify(token, config.jwt.refreshSecret, {
                algorithms: ['HS256']
            });

            // Check if token exists in database
            const storedToken = await Token.findOne({
                refreshToken: token,
                user: decoded.sub
            });

            if (!storedToken) {
                throw new Error('Token not found');
            }

            return decoded;
        } catch (error) {
            throw new ApiError(401, 'Invalid refresh token');
        }
    },

    /**
     * Generate password reset token
     * @param {Object} user - User object
     * @returns {string} Reset token
     */
    generateResetToken: (user) => {
        return jwt.sign(
            { sub: user._id },
            config.jwt.resetSecret,
            { expiresIn: "7d" }
        );
    },

    /**
     * Verify password reset token
     * @param {string} token - Reset token
     * @returns {Object} Decoded token payload
     */
    verifyResetToken: (token) => {
        try {
            return jwt.verify(token, config.jwt.resetSecret);
        } catch (error) {
            throw new ApiError(401, 'Invalid reset token');
        }
    }
};

export const {
    generateAuthTokens,
    verifyAccessToken,
    verifyRefreshToken,
    generateResetToken,
    verifyResetToken
} = tokenService;