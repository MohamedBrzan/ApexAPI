import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    domains: [String],
    billingAddress: mongoose.Schema.Types.Mixed,
    subscription: {
        plan: { type: String, enum: ['free', 'pro', 'enterprise'] },
        status: { type: String, enum: ['active', 'canceled', 'suspended'] },
        renewalDate: Date
    },
    configuration: {
        authProviders: mongoose.Schema.Types.Mixed,
        customFields: mongoose.Schema.Types.Mixed
    },
    metadata: mongoose.Schema.Types.Mixed,
    auditLogs: [{
        timestamp: Date,
        user: mongoose.Schema.Types.ObjectId,
        action: String,
        details: mongoose.Schema.Types.Mixed
    }]
}, {
    timestamps: true,
    shardKey: { _id: 'hashed' }
});

export default mongoose.model('Organization', organizationSchema);