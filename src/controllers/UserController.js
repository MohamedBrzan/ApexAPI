import UserService from '../services/UserService.js';
import { validationResult } from 'express-validator';
import { logger } from '../middleware/logging.js';
import { generateAuthTokens } from '../utils/auth.js';
import { ApiError } from '../middleware/errorMiddleware.js';
import TokenService from '../services/TokenService.js';
import { sanitizeUser } from '../utils/sanitizers.js';

export default class UserController {
    static async register(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const user = await UserService.createUser(req.body);
            logger.info(`User registered: ${user.email}`);

            const tokens = await generateAuthTokens(req, user);
            res.setHeader('X-Refresh-Token', tokens.refreshToken);

            res.status(201).json({
                success: true,
                data: {
                    user: sanitizeUser(user),
                    accessToken: tokens.accessToken
                },
                meta: {
                    rateLimit: req.rateLimit
                }
            });
        } catch (error) {
            logger.error(`Registration error: ${error.message}`);
            next(new ApiError(409, error.message));
        }
    }

    static async login(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array().map(err => ({
                    param: err.param,
                    message: err.msg,
                    location: err.location
                }))
            });
        }

        const { email, password, deviceInfo } = req.body;

        try {
            // Find user with password field included
            const user = await UserService.findByCredentials(email, password);

            if (!user) {
                logger.warn(`Login attempt for unknown email: ${email}`);
                throw new ApiError(401, 'Invalid credentials');
            }

            // Check account lock status
            if (user.accountLockedUntil > Date.now()) {
                const retryAfter = Math.ceil((user.accountLockedUntil - Date.now()) / 1000);
                res.set('Retry-After', retryAfter);
                throw new ApiError(423, 'Account temporarily locked');
            }

            // Verify password
            const isMatch = await UserService.comparePassword(password, user.password);
            if (!isMatch) {
                await UserService.handleFailedLoginAttempt(user._id);
                logger.warn(`Failed login attempt for user: ${user._id}`);
                throw new ApiError(401, 'Invalid credentials');
            }

            // Check if email is verified
            if (!user.isEmailVerified) {
                throw new ApiError(403, 'Email verification required');
            }

            // Generate tokens
            const tokens = await generateAuthTokens(req, user);

            // Store refresh token
            await TokenService.storeRefreshToken(user._id, {
                refreshToken: tokens.refreshToken || 'Unknown',
                expiresAt: tokens.refreshExpiresAt || new Date(Date.now() + 1000 * 1000),
                deviceInfo: deviceInfo || req.headers['user-agent'] || 'Unknown',
                userAgent: req.headers['user-agent'] || 'Unknown',
                ip: req.ip || 'Unknown'
            });

            // Set refresh token in HTTP-only cookie
            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 1000 * 1000,
                path: '/api/v1/auth/refresh-token'
            });

            // Response headers for security
            res.set({
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'DENY',
                'Content-Security-Policy': "default-src 'self'"
            });

            res.json({
                success: true,
                data: {
                    user: sanitizeUser(user),
                    accessToken: tokens.accessToken,
                    expiresIn: tokens.accessExpiresIn
                },
                meta: {
                    rateLimit: req.rateLimit,
                    security: {
                        mfaEnabled: !!user.multiFactorAuth.enabled,
                        lastLogin: user.lastLogin
                    }
                }
            });

            // Update last login and reset failed attempts
            await UserService.updateLoginSuccess(user._id, req.ip);

        } catch (error) {
            next(error);
        }
    }

    static async getProfile(req, res, next) {
        try {
            const user = await UserService.getUserById(req.user.id, {
                includeStats: true,
                includeSessions: true
            });

            res.json({
                success: true,
                data: sanitizeUser(user),
                meta: {
                    cache: req.cacheStatus
                }
            });
        } catch (error) {
            next(new ApiError(404, 'User not found'));
        }
    }

    static async updateProfile(req, res, next) {
        try {
            const user = await UserService.updateUser(req.user.id, req.body);
            res.json({
                success: true,
                data: sanitizeUser(user),
                meta: {
                    changes: req.auditTrail
                }
            });
        } catch (error) {
            next(new ApiError(400, error.message));
        }
    }

    static async updateUser(req, res, next) {
        try {
            // Optionally, you can add express-validator checks for req.body here
            const user = await UserService.updateUser(req.params.id, req.body);
            if (!user) {
                // If no user was found to update, pass a 404 error to the error handler
                return next(new ApiError(404, 'User not found'));
            }

            logger.info(`User updated: ${user.email}`);
            res.json({
                success: true,
                data: sanitizeUser(user)
            });
        } catch (error) {
            logger.error(`Update user error: ${error.message}`);
            next(new ApiError(400, error.message));
        }
    }

    static async deleteUser(req, res, next) {
        try {
            const deleted = await UserService.deleteUser(req.params.id);
            if (!deleted) {
                // If no user was found to delete, pass a 404 error to the error handler
                return next(new ApiError(404, 'User not found'));
            }

            logger.info(`User deleted: ${req.params.id}`);
            res.json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error) {
            logger.error(`Delete user error: ${error.message}`);
            next(new ApiError(400, error.message));
        }
    }
}