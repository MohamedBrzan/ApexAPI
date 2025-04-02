import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true,
        maxlength: [120, 'Title cannot exceed 120 characters']
    },
    content: {
        type: String,
        required: [true, 'Please provide content']
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    tags: [{
        type: String,
        enum: ['technology', 'design', 'development', 'career']
    }],
    featuredImage: String,
    views: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    slug: String
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual populate comments
postSchema.virtual('comments', {
    ref: 'Comment',
    foreignField: 'post',
    localField: '_id'
});

// Indexes for search optimization
postSchema.index({ title: 'text', content: 'text' });
postSchema.index({ author: 1, createdAt: -1 });

export default mongoose.model('Post', postSchema);