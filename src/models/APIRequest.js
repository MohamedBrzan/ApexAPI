import mongoose from 'mongoose';

const apiRequestSchema = new mongoose.Schema({
    endpoint: String,
    method: String,
    statusCode: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    responseTime: Number,
    requestSize: Number,
    responseSize: Number,
    ipAddress: String,
    userAgent: String,
    headers: mongoose.Schema.Types.Mixed,
    queryParams: mongoose.Schema.Types.Mixed,
    error: {
        message: String,
        stack: String,
        code: String
    }
}, {
    timestamps: true,
    timeseries: {
        timeField: 'createdAt',
        metaField: 'metadata',
        granularity: 'hours'
    }
});

export default mongoose.model('APIRequest', apiRequestSchema);