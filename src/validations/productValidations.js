import Joi from 'joi';
import { isValidSKU } from '../utils/securityHelpers.js';
import { sanitizeHTML } from '../utils/sanitizers.js';

// Custom validators
const mongoId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).message('Invalid ID format');
const currency = Joi.number().precision(2).positive();
const inventorySchema = Joi.object({
    stock: Joi.number().integer().min(0).required(),
    lowStockThreshold: Joi.number().integer().min(0),
    warehouseLocation: mongoId.required()
});

export const createProductSchema = Joi.object({
    sku: Joi.string()
        .custom(isValidSKU)
        .required()
        .label('SKU')
        .messages({
            'any.custom': 'Invalid SKU format (AAA-000-XXX)'
        }),

    name: Joi.string()
        .min(3)
        .max(100)
        .required()
        .trim()
        .label('Product Name'),

    description: Joi.string()
        .min(50)
        .max(2000)
        .required()
        .custom(sanitizeHTML)
        .label('Description'),

    variants: Joi.array()
        .items(
            Joi.object({
                option: Joi.string().required(),
                sku: Joi.string().required(),
                price: currency.required(),
                salePrice: currency.max(Joi.ref('price')),
                inventory: inventorySchema.required(),
                attributes: Joi.object().pattern(/^[a-z0-9_]+$/, Joi.alternatives().try(
                    Joi.string(),
                    Joi.number(),
                    Joi.boolean()
                ))
            })
        )
        .min(1)
        .required()
        .label('Product Variants'),

    categories: Joi.array()
        .items(mongoId)
        .min(1)
        .required()
        .label('Categories'),

    attributes: Joi.object()
        .pattern(/^[a-z0-9_]+$/, Joi.alternatives().try(
            Joi.string(),
            Joi.number(),
            Joi.boolean(),
            Joi.array()
        ))
        .label('Product Attributes'),

    images: Joi.array()
        .items(
            Joi.string().uri().required()
        )
        .label('Product Images'),

    status: Joi.string()
        .valid('draft', 'active', 'archived')
        .default('draft')
}).options({ abortEarly: false });

export const updateInventorySchema = Joi.object({
    variantIndex: Joi.number()
        .integer()
        .min(0)
        .required()
        .label('Variant Index'),

    quantity: Joi.number()
        .integer()
        .required()
        .label('Quantity Adjustment')
});

export const addReviewSchema = Joi.object({
    rating: Joi.number()
        .min(1)
        .max(5)
        .required()
        .label('Rating'),

    title: Joi.string()
        .min(5)
        .max(100)
        .trim()
        .required(),

    comment: Joi.string()
        .min(10)
        .max(1000)
        .trim()
        .custom(sanitizeHTML)
        .required(),

    userId: mongoId.required()
});

export const searchProductsSchema = Joi.object({
    query: Joi.string()
        .min(2)
        .max(100)
        .required()
        .trim(),

    page: Joi.number()
        .integer()
        .min(1)
        .default(1),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(25),

    sortBy: Joi.string()
        .valid('price', 'rating', 'createdAt', 'popularity')
        .default('createdAt'),

    minPrice: currency,
    maxPrice: currency,
    inStock: Joi.boolean(),
    category: Joi.alternatives().try(
        Joi.array().items(mongoId),
        mongoId
    )
});

export const bulkUpdateSchema = Joi.array()
    .items(
        Joi.object({
            productId: mongoId.required(),
            update: Joi.object({
                price: currency,
                salePrice: currency,
                inventory: inventorySchema
            }).min(1).required()
        })
    )
    .min(1)
    .max(100)
    .label('Bulk Updates');

export const productVariantSchema = Joi.object({
    option: Joi.string().required(),
    sku: Joi.string().required(),
    price: currency.required(),
    attributes: Joi.object().pattern(/^[a-z0-9_]+$/, Joi.alternatives().try(
        Joi.string(),
        Joi.number(),
        Joi.boolean()
    ))
});

export const relatedProductsSchema = Joi.object({
    limit: Joi.number()
        .integer()
        .min(1)
        .max(20)
        .default(5)
});

export const validateOptions = {
    abortEarly: false,
    stripUnknown: true,
    allowUnknown: false,
    errors: {
        escapeHtml: true,
        wrap: { label: false }
    }
};