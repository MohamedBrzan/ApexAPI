import Notification from '../models/Notification.js';
// import { notify } from '../integrations/emailService';

export default class NotificationService {
    static async queueNotification(notificationData) {
        return Notification.create(notificationData);
    }

    static async processPendingNotifications(batchSize = 100) {
        const pending = await Notification.find({
            status: 'pending',
            $or: [
                { lastAttempt: { $lt: new Date(Date.now() - 5 * 60 * 1000) } },
                { lastAttempt: { $exists: false } }
            ]
        }).limit(batchSize);

        for (const notification of pending) {
            try {
                await notify(notification);
                notification.status = 'sent';
            } catch (error) {
                notification.status = 'failed';
                notification.retryCount += 1;
            }
            notification.lastAttempt = new Date();
            await notification.save();
        }

        return pending.length;
    }
}