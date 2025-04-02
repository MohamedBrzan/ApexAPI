// src/validations/postValidations.js
import Joi from 'joi';
import { sanitizeHTML } from '../utils/sanitizers.js';

// Custom MongoDB ID validation
const mongoId = Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .message('Invalid ID format');

export const createPostSchema = Joi.object({
    title: Joi.string()
        .min(10)
        .max(120)
        .required()
        .trim()
        .label('Post Title')
        .messages({
            'string.empty': 'Title cannot be empty',
            'string.min': 'Title must be at least {#limit} characters',
            'string.max': 'Title cannot exceed {#limit} characters'
        }),

    content: Joi.string()
        .min(100)
        .max(10000)
        .required()
        .custom(sanitizeHTML)
        .label('Post Content')
        .messages({
            'string.empty': 'Content cannot be empty',
            'string.min': 'Content must be at least {#limit} characters'
        }),

    tags: Joi.array()
        .items(
            Joi.string()
                .max(20)
                .trim()
        )
        .max(5)
        .label('Post Tags')
        .messages({
            'array.max': 'Cannot add more than {#limit} tags'
        }),

    featuredImage: Joi.string()
        .uri()
        .optional()
        .label('Featured Image URL'),

    status: Joi.string()
        .valid('draft', 'published', 'archived')
        .default('draft')
        .label('Post Status'),

    author: mongoId
        .required()
        .label('Author ID'),

    organization: mongoId
        .required()
        .label('Organization ID')
});

export const updatePostSchema = Joi.object({
    title: Joi.string()
        .min(10)
        .max(120)
        .trim(),

    content: Joi.string()
        .min(100)
        .max(10000)
        .custom(sanitizeHTML),

    tags: Joi.array()
        .items(
            Joi.string()
                .max(20)
                .trim()
        )
        .max(5),

    featuredImage: Joi.string()
        .uri(),

    status: Joi.string()
        .valid('draft', 'published', 'archived'),

    slug: Joi.string()
        .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .message('Invalid slug format')
}).min(1); // At least one field required for update

export const listPostsSchema = Joi.object({
    page: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .label('Page number'),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(20)
        .label('Items per page'),

    sortBy: Joi.string()
        .valid('createdAt', 'updatedAt', 'views', 'title')
        .default('createdAt')
        .label('Sort field'),

    sortOrder: Joi.string()
        .valid('asc', 'desc')
        .default('desc')
        .label('Sort order'),

    status: Joi.string()
        .valid('draft', 'published', 'archived'),

    tags: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
    ).custom((value, helpers) => {
        if (typeof value === 'string') return value.split(',');
        return value;
    })
});

export const searchPostsSchema = Joi.object({
    query: Joi.string()
        .min(3)
        .max(100)
        .required()
        .trim()
        .label('Search query'),

    page: Joi.number()
        .integer()
        .min(1)
        .default(1),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(10)
});

export const postIdSchema = Joi.object({
    id: mongoId
        .required()
        .label('Post ID')
});

// Validation configuration
export const postValidationOptions = {
    abortEarly: false,
    stripUnknown: true,
    allowUnknown: false,
    errors: {
        escapeHtml: true,
        wrap: { label: false }
    }
};