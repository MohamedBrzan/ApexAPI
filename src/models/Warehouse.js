import mongoose from 'mongoose';

const warehouseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    location: {
        address: String,
        city: String,
        country: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    capacity: {
        total: Number,
        used: Number
    },
    features: [String],
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['active', 'maintenance', 'closed'],
        default: 'active'
    },
    inventory: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductCatalog'
        },
        variant: String,
        quantity: Number
    }]
}, {
    timestamps: true,
    shardKey: { organization: 1 }
});

export default mongoose.model('Warehouse', warehouseSchema);