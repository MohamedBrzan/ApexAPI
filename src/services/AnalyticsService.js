import Analytics from '../models/Analytics.js';

export default class AnalyticsService {
    static async logRequest(requestData) {
        return Analytics.create(requestData);
    }

    static async getMetrics(timeRange = '24h') {

        const metrics = await Analytics.aggregate([
            { $match: this._getTimeFilter(timeRange) },
            {
                $group: {
                    _id: '$statusCode',
                    count: { $sum: 1 },
                    avgResponseTime: { $avg: '$responseTime' }
                }
            }
        ]);

        return metrics;
    }

    static _getTimeFilter(timeRange) {
        const now = new Date();
        const filters = {
            '24h': { $gte: new Date(now - 24 * 60 * 60 * 1000) },
            '7d': { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) }
        };
        return { createdAt: filters[timeRange] || { $gte: new Date(0) } };
    }
}