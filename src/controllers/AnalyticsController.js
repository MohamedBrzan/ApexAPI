import AnalyticsService from '../services/AnalyticsService.js';
import { cacheMiddleware } from '../middleware/cacheMiddleware.js';

export default class AnalyticsController {
    static async getSystemMetrics(req, res, next) {
        try {
            const { timeframe, resolution } = req.query;
            const metrics = await AnalyticsService.getAggregatedMetrics({
                timeframe,
                resolution,
                orgId: req.user.organization
            });

            res.json({
                success: true,
                data: metrics,
                meta: {
                    generatedAt: new Date().toISOString(),
                    resolution
                }
            });
        } catch (error) {
            next(new ApiError(500, 'Failed to retrieve metrics'));
        }
    }

    static async getEndpointAnalytics(req, res, next) {
        try {
            const data = cacheMiddleware('analytics', req.originalUrl, async () => {
                return AnalyticsService.getEndpointStats({
                    endpoint: req.params.endpoint,
                    days: req.query.days || 7
                });
            });

            res.json({
                success: true,
                data,
                meta: {
                    cache: req.cacheStatus
                }
            });
        } catch (error) {
            next(new ApiError(500, 'Analytics retrieval failed'));
        }
    }

    static async getSystemHealth(req, res, next) {
        try {
            const health = await AnalyticsService.getSystemHealth();
            res.json({
                success: true,
                data: health,
                meta: {
                    generatedAt: new Date().toISOString()
                }
            });
        } catch (error) {
            next(new ApiError(500, 'Failed to retrieve system health data'));
        }
    }
}