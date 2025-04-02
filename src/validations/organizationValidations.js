import Joi from 'joi';
import { isValidDomain } from '../utils/validationHelpers.js';

const mongoId = Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .message('Invalid ID format');

export const createOrganizationSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(100)
        .required()
        .trim()
        .label('Organization Name')
        .messages({
            'string.empty': 'Organization name is required',
            'string.min': 'Name must be at least {#limit} characters',
            'string.max': 'Name cannot exceed {#limit} characters'
        }),

    email: Joi.string()
        .email()
        .required()
        .normalize()
        .label('Billing Email')
        .messages({
            'string.email': 'Please provide a valid email address'
        }),

    phone: Joi.string()
        .pattern(/^\+?[1-9]\d{1,14}$/)
        .messages({
            'string.pattern.base': 'Invalid phone number format'
        })
        .required(),

    address: Joi.object({
        street: Joi.string().trim().max(100).required(),
        city: Joi.string().trim().max(50).required(),
        state: Joi.string().trim().max(50).required(),
        country: Joi.string().trim().max(50).required(),
        postalCode: Joi.string().trim().max(20).required()
    }).required(),

    industry: Joi.string()
        .valid('technology', 'finance', 'healthcare', 'education', 'other')
        .required(),

    size: Joi.string()
        .valid('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+')
        .required()
}).options({ abortEarly: false });

export const updateSubscriptionSchema = Joi.object({
    plan: Joi.string()
        .valid('free', 'pro', 'enterprise')
        .required()
        .label('Subscription Plan'),

    paymentMethodId: Joi.string()
        .required()
        .label('Payment Method'),

    billingCycle: Joi.string()
        .valid('monthly', 'annual')
        .required()
});

export const domainManagementSchema = Joi.object({
    domain: Joi.string()
        .custom(isValidDomain)
        .required()
        .label('Organization Domain')
        .messages({
            'any.custom': 'Invalid domain format'
        })
});

export const inviteUserSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .label('User Email'),

    role: Joi.string()
        .valid('member', 'admin', 'billing')
        .required()
        .label('User Role'),

    teams: Joi.array()
        .items(mongoId)
        .label('Team IDs')
});

export const auditLogSchema = Joi.object({
    page: Joi.number()
        .integer()
        .min(1)
        .default(1),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(50),

    actionType: Joi.string()
        .valid('user', 'billing', 'settings')
});

export const updateMembershipSchema = Joi.object({
    userId: mongoId
        .required(),

    role: Joi.string()
        .valid('member', 'admin', 'billing')
        .required(),

    status: Joi.string()
        .valid('active', 'suspended', 'pending')
        .required()
});

export const securitySettingsSchema = Joi.object({
    passwordPolicy: Joi.object({
        minLength: Joi.number().min(8).max(32),
        requireSpecialChar: Joi.boolean(),
        requireNumber: Joi.boolean(),
        expireInDays: Joi.number().min(0)
    }),

    mfa: Joi.object({
        required: Joi.boolean(),
        methods: Joi.array().items(Joi.string().valid('sms', 'email', 'authenticator'))
    }),

    sessionSettings: Joi.object({
        idleTimeout: Joi.number().min(5),
        maxDuration: Joi.number().min(15)
    })
});

// Custom domain validation helper
export const forbiddenDomains = [
    'gmail.com',
    'yahoo.com',
    'outlook.com'
];

export const validateOptions = {
    abortEarly: false,
    stripUnknown: true,
    allowUnknown: false,
    errors: {
        escapeHtml: true,
        wrap: { label: false }
    }
};