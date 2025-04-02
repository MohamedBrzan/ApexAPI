import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    type: { type: String, enum: ['email', 'sms', 'push', 'in-app'] },
    status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
    subject: String,
    content: mongoose.Schema.Types.Mixed,
    retryCount: { type: Number, default: 0 },
    lastAttempt: Date,
    metadata: mongoose.Schema.Types.Mixed,
    providerResponse: mongoose.Schema.Types.Mixed
}, {
    timestamps: true,
    shardKey: { user: 1 }
});

export default mongoose.model('Notification', notificationSchema);