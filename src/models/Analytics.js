import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
    endpoint: {
        type: String,
        required: true
    },
    method: {
        type: String,
        enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    },
    statusCode: {
        type: Number,
        required: true
    },
    responseTime: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    metadata: mongoose.Schema.Types.Mixed
}, {
    timestamps: true
});

// Index for frequent queries
analyticsSchema.index({ endpoint: 1, method: 1, createdAt: -1 });

export default mongoose.model('Analytics', analyticsSchema);