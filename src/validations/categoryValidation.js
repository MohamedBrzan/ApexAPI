import Joi from 'joi';

export const categoryValidationSchema = Joi.object({
    name: Joi.string()
        .trim()
        .max(100)
        .required()
        .messages({
            'string.empty': 'Category name is required',
            'string.max': 'Category name cannot exceed 100 characters'
        }),

    description: Joi.string()
        .trim()
        .max(500)
        .optional()
        .messages({
            'string.max': 'Description cannot exceed 500 characters'
        }),

    parent: Joi.string()
        .trim()
        .pattern(/^[0-9a-fA-F]{24}$/, 'MongoDB ObjectId')
        .optional()
        .messages({
            'string.pattern.name': 'Parent category must be a valid MongoDB ObjectId'
        }),

    image: Joi.string()
        .trim()
        .uri()
        .optional()
        .messages({
            'string.uri': 'Image must be a valid URL'
        }),

    meta: Joi.object({
        seoTitle: Joi.string().trim().optional(),
        seoDescription: Joi.string().trim().optional(),
        keywords: Joi.array().items(Joi.string().trim()).optional()
    }).optional()
});
