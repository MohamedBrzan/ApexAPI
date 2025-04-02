import Joi from 'joi';
import { passwordComplexity } from '../utils/validationHelpers.js';

export const registerSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .label('Full Name')
        .messages({
            'string.empty': 'Name is required',
            'string.min': 'Name must be at least {#limit} characters',
            'string.max': 'Name cannot exceed {#limit} characters'
        }),

    email: Joi.string()
        .trim()
        .lowercase()
        .email({ tlds: { allow: false } })
        .required()
        .label('Email')
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),

    password: passwordComplexity
        .required()
        .label('Password')
        .messages({
            'any.required': 'Password is required'
        }),

    confirmPassword: Joi.any()
        .valid(Joi.ref('password'))
        .required()
        .label('Confirm Password')
        .messages({
            'any.only': 'Passwords do not match',
            'any.required': 'Confirm Password is required'
        }),

    phone: Joi.string()
        .pattern(/^\+?[1-9]\d{1,14}$/)  // E.164 format
        .optional()
        .label('Phone Number')
        .messages({
            'string.pattern.base': 'Invalid phone number format'
        }),

    role: Joi.string()
        .valid('user', 'admin')
        .default('user')
        .label('Role')
        .messages({
            'any.only': 'Invalid user role'
        }),

    termsAccepted: Joi.boolean()
        .valid(true)
        .required()
        .label('Terms and Conditions')
        .messages({
            'any.only': 'You must accept the terms and conditions',
            'any.required': 'Terms and conditions acceptance is required'
        })
})
    .with('password', 'confirmPassword')
    .with('email', 'termsAccepted');


export const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .normalize()
        .label('Email'),

    password: Joi.string()
        .required()
        .label('Password'),

    deviceId: Joi.string()
        .required()
        .label('Device ID'),

    ipAddress: Joi.string()
        .ip()
        .required()
        .label('IP Address')
});

export const updateProfileSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .trim()
        .label('Full Name'),

    phone: Joi.string()
        .pattern(/^\+?[1-9]\d{1,14}$/)
        .messages({
            'string.pattern.base': 'Invalid phone number format'
        }),

    avatar: Joi.string()
        .uri()
        .optional()
}).or('name', 'phone', 'avatar');

export const changePasswordSchema = Joi.object({
    currentPassword: Joi.string()
        .required()
        .label('Current Password'),

    newPassword: passwordComplexity
        .invalid(Joi.ref('currentPassword'))
        .label('New Password')
        .messages({
            'any.invalid': 'New password must be different from current password'
        }),

    confirmPassword: Joi.string()
        .valid(Joi.ref('newPassword'))
        .required()
        .label('Confirm Password')
        .messages({
            'any.only': 'Passwords do not match'
        })
});

export const emailVerificationSchema = Joi.object({
    token: Joi.string()
        .hex()
        .length(64)
        .required()
        .label('Verification Token')
});

export const resetPasswordSchema = Joi.object({
    token: Joi.string()
        .hex()
        .length(64)
        .required()
        .label('Reset Token'),

    newPassword: passwordComplexity
        .required()
        .label('New Password')
});

// Additional validation helpers
export const validateOptions = {
    abortEarly: false,
    stripUnknown: true,
    allowUnknown: false,
    errors: {
        escapeHtml: true,
        wrap: {
            label: false
        }
    }
};