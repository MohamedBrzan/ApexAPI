import { Router } from 'express';
import NotificationController from '../controllers/NotificationController.js';
import IsAuthenticated from '../middleware/IsAuthenticated.js';

const router = Router();

router.post(
    '/notifications',
    IsAuthenticated(),
    NotificationController.createNotification
);

router.get(
    '/notifications/status/:notificationId',
    IsAuthenticated(),
    NotificationController.getNotificationStatus
);

export default router;