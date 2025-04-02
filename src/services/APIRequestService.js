import APIRequest from "../models/APIRequest.js";

export default class APIRequestService {
    static async logRequest(requestData) {
        return APIRequest.create(requestData);
    }

    static async analyzePerformance(window = '5m') {
        return APIRequest.aggregate([
            { $match: { createdAt: { $gte: new Date(Date.now() - 300000) } } },
            {
                $group: {
                    _id: '$endpoint',
                    avgResponseTime: { $avg: '$responseTime' },
                    errorRate: {
                        $avg: {
                            $cond: [{ $gte: ['$statusCode', 400] }, 1, 0]
                        }
                    }
                }
            }
        ]);
    }
}