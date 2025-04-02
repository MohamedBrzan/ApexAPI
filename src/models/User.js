import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Please provide a valid email address'
        }
    },
    phone: {
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                return /^\+?[1-9]\d{1,14}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: false
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    roles: [{
        type: String,
        enum: ['admin', 'manager', 'user', 'support'],
        default: 'user'
    }],
    authStrategies: {
        local: { type: Boolean, default: false },
        google: String,
        saml: String
    },
    multiFactorAuth: {
        enabled: Boolean,
        secret: String,
        recoveryCodes: [String]
    },
    permissions: [{
        resource: String,
        actions: [String],
        conditions: mongoose.Schema.Types.Mixed
    }],
    activityLog: [{
        timestamp: Date,
        eventType: String,
        metadata: mongoose.Schema.Types.Mixed
    }],
    preferences: mongoose.Schema.Types.Mixed,
    version: { type: Number, default: 0 }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Password hashing middleware
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Instance method for password validation
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// Query middleware to filter out inactive users
userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});

export default mongoose.model('User', userSchema);