import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        index: true,
        required: true
    },
    sku: { type: String, unique: true, required: true },
    name: { type: String, required: true, text: true },
    description: { type: String, text: true },
    variants: [{
        option: String,
        price: Number,
        inventory: {
            stock: Number,
            lowStockThreshold: Number,
            warehouseLocation: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Warehouse'
            }
        }
    }],
    attributes: mongoose.Schema.Types.Mixed,
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    reviews: [{
        user: mongoose.Schema.Types.ObjectId,
        rating: Number,
        comment: String
    }],
    searchVector: { type: mongoose.Schema.Types.Map, select: false }
}, {
    timestamps: true,
    shardKey: { organization: 1 }
});

// Text search index
productSchema.index({ name: 'text', description: 'text' }, { weights: { name: 3, description: 1 } });

export default mongoose.model('Product', productSchema);