import NotificationService from '../services/NotificationService.js';

export default class NotificationController {
    static async createNotification(req, res, next) {
        try {
            const notification = await NotificationService.queueNotification({
                ...req.body,
                user: req.user.id,
                organization: req.user.organization
            });

            res.status(202).json({
                success: true,
                data: {
                    notificationId: notification.id,
                    status: notification.status
                },
                meta: {
                    estimatedDelivery: new Date(Date.now() + 30000).toISOString()
                }
            });
        } catch (error) {
            next(new ApiError(500, 'Notification queuing failed'));
        }
    }

    static async getNotificationStatus(req, res, next) {
        try {
            const notification = await NotificationService.getStatus(
                req.params.notificationId
            );

            res.json({
                success: true,
                data: {
                    status: notification.status,
                    retries: notification.retryCount
                }
            });
        } catch (error) {
            next(new ApiError(404, 'Notification not found'));
        }
    }
}