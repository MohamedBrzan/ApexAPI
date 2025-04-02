import { Router } from 'express';
import APIRequestController from '../controllers/APIRequestController.js';
import IsAuthenticated from '../middleware/IsAuthenticated.js';

const router = Router();

router.get(
    '/requests/metrics',
    IsAuthenticated,
    APIRequestController.getRequestMetrics
);

router.get(
    '/requests/errors',
    IsAuthenticated,
    APIRequestController.getRecentErrors
);

export default router;