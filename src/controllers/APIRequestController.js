import APIRequestService from '../services/APIRequestService.js';
import { ApiError } from '../middleware/errorMiddleware.js';

export class APIRequestController {
    /**
     * @desc    Get API request metrics
     * @route   GET /api/v1/requests/metrics
     * @access  Private/Admin
     */
    static async getRequestMetrics(req, res, next) {
        try {
            const { timeframe = '24h', resolution = 'hourly' } = req.query;

            if (cachedData) {
                return res.json({
                    success: true,
                    data: JSON.parse(cachedData),
                    meta: { cached: true }
                });
            }

            const metrics = await APIRequestService.getRequestMetrics({
                timeframe,
                resolution,
                organization: req.user.organization
            });

            res.json({
                success: true,
                data: metrics,
                meta: {
                    timeframe,
                    resolution,
                    generatedAt: new Date().toISOString()
                }
            });
        } catch (error) {
            next(new ApiError(500, 'Failed to retrieve request metrics'));
        }
    }

    /**
     * @desc    Get recent API errors
     * @route   GET /api/v1/requests/errors
     * @access  Private/Admin
     */
    static async getRecentErrors(req, res, next) {
        try {
            const { page = 1, limit = 50 } = req.query;
            const errors = await APIRequestService.getRecentErrors({
                organization: req.user.organization,
                page: parseInt(page),
                limit: parseInt(limit)
            });

            res.json({
                success: true,
                data: errors,
                meta: {
                    total: errors.totalCount,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(errors.totalCount / limit)
                }
            });
        } catch (error) {
            next(new ApiError(500, 'Failed to retrieve error logs'));
        }
    }

    /**
     * @desc    Get endpoint performance stats
     * @route   GET /api/v1/requests/performance
     * @access  Private/Admin
     */
    static async getPerformanceStats(req, res, next) {
        try {
            const stats = await APIRequestService.analyzePerformance({
                organization: req.user.organization,
                minResponseTime: parseInt(req.query.minResponseTime) || 1000,
                maxErrorRate: parseFloat(req.query.maxErrorRate) || 0.1
            });

            res.json({
                success: true,
                data: stats,
                meta: {
                    threshold: {
                        responseTime: stats.threshold.responseTime,
                        errorRate: stats.threshold.errorRate
                    }
                }
            });
        } catch (error) {
            next(new ApiError(500, 'Failed to analyze performance'));
        }
    }

    /**
     * @desc    Get API usage statistics
     * @route   GET /api/v1/requests/usage
     * @access  Private/Admin
     */
    static async getUsageStatistics(req, res, next) {
        try {
            const { groupBy = 'endpoint', period = 'daily' } = req.query;
            const usageStats = await APIRequestService.getUsageStatistics({
                organization: req.user.organization,
                groupBy,
                period
            });

            res.json({
                success: true,
                data: usageStats,
                meta: {
                    groupBy,
                    period,
                    totalRequests: usageStats.reduce((sum, item) => sum + item.count, 0)
                }
            });
        } catch (error) {
            next(new ApiError(500, 'Failed to retrieve usage statistics'));
        }
    }

    /**
     * @desc    Get slowest endpoints
     * @route   GET /api/v1/requests/slowest
     * @access  Private/Admin
     */
    static async getSlowestEndpoints(req, res, next) {
        try {
            const slowEndpoints = await APIRequestService.getSlowEndpoints({
                organization: req.user.organization,
                limit: parseInt(req.query.limit) || 10,
                minCalls: parseInt(req.query.minCalls) || 100
            });

            res.json({
                success: true,
                data: slowEndpoints,
                meta: {
                    threshold: {
                        minCalls: parseInt(req.query.minCalls) || 100
                    }
                }
            });
        } catch (error) {
            next(new ApiError(500, 'Failed to retrieve slow endpoints'));
        }
    }
}

export default APIRequestController;