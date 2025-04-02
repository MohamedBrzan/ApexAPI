import mongoose from 'mongoose';

const eventLogSchema = new mongoose.Schema({
    eventType: { type: String, required: true },
    aggregateId: { type: String, required: true },
    payload: mongoose.Schema.Types.Mixed,
    correlationId: String,
    userId: mongoose.Schema.Types.ObjectId,
    organizationId: mongoose.Schema.Types.ObjectId,
    version: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
}, {
    capped: { size: 1024 * 1024 * 100, max: 1000000 }
});

eventLogSchema.index({ aggregateId: 1, version: 1 }, { unique: true });
eventLogSchema.index({ timestamp: -1 });

export default mongoose.model('EventLog', eventLogSchema);