import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User.js';
import TokenService from './TokenService.js';

export default class UserService {
    static async createUser(userData) {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) throw new Error('User already exists');

        const user = await User.create(userData);
        await this.sendVerificationEmail(user);
        return user.toObject();
    }

    static async getUserById(userId) {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');
        return user.toObject();
    }

    static async updateUser(userId, updateData) {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        Object.keys(updateData).forEach(key => {
            user[key] = updateData[key];
        });

        await user.save();
        return user.toObject();
    }

    static async deleteUser(userId) {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        await TokenService.revokeAllTokensForUser(user._id);

        // Soft delete (preferred)
        // user.status = 'deleted';
        // await user.save();

        // Or hard delete
        await user.deleteOne();
        return { message: 'User deleted successfully' };
    }

    static async sendVerificationEmail(user) {
        const token = crypto.randomBytes(32).toString('hex');
        user.emailVerificationToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');
        user.emailVerificationExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Implement email sending logic here
    }

    static async findByCredentials(email, password) {
        const user = await User.findOne({ email }).select('+password');
        if (!user) throw new Error('Invalid credentials');
        return user;
    }

    static async updatePassword(userId, newPassword) {
        const user = await User.findById(userId);
        user.password = newPassword;
        await user.save();
        await TokenService.revokeAllTokensForUser(userId);
        return user;
    }

    static async handleMultiFactorAuth(userId, code) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        if (!user.multiFactorAuth || !user.multiFactorAuth.enabled || !user.multiFactorAuth.secret) {
            throw new Error('Multi-factor authentication is not enabled for this user');
        }
        const verified = speakeasy.totp.verify({
            secret: user.multiFactorAuth.secret,
            encoding: 'base32',
            token: code,
            window: 1  // allows for slight clock drift
        });
        if (!verified) {
            throw new Error('Invalid multi-factor authentication code');
        }
        return true;
    }

    static async handleFailedLoginAttempt(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        // Increment failed login attempts (initialize if undefined)
        user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
        const MAX_ATTEMPTS = 5;
        if (user.failedLoginAttempts >= MAX_ATTEMPTS) {
            // Lock account for 15 minutes
            user.accountLockedUntil = Date.now() + 15 * 60 * 1000;
            // Optionally reset failed login attempts after locking
            user.failedLoginAttempts = 0;
        }
        await user.save();
    }

    static async updateLoginSuccess(userId, ip) {
        try {
            const update = {
                lastLogin: new Date(),
                loginAttempts: 0,
                lockUntil: undefined
            };

            const user = await User.findByIdAndUpdate(userId, update, { new: true });

            // Optionally log the IP address or perform additional actions
            console.log(`User ${userId} logged in successfully from IP: ${ip}`);

            return user;
        } catch (error) {
            console.error('Error updating login success information:', error);
            throw new Error('Error updating login success information');
        }
    }
}