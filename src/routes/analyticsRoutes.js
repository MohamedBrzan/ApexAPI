import { Router } from 'express';
import AnalyticsController from '../controllers/AnalyticsController.js';
import IsAuthenticated from '../middleware/IsAuthenticated.js';
import { cacheMiddleware } from '../middleware/cacheMiddleware.js';

const router = Router();

router.get(
    '/metrics',
    IsAuthenticated,
    cacheMiddleware('5 minutes'),
    AnalyticsController.getSystemMetrics
);

router.get(
    '/endpoints/:endpoint',
    IsAuthenticated,
    AnalyticsController.getEndpointAnalytics
);

router.get(
    '/health',
    AnalyticsController.getSystemHealth
);

export default router;