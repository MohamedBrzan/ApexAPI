// src/validations/apiRequestValidations.js
import Joi from 'joi';

export const metricsSchema = Joi.object({
    timeframe: Joi.string()
        .valid('1h', '24h', '7d', '30d')
        .default('24h'),
    resolution: Joi.string()
        .valid('minute', 'hourly', 'daily')
        .default('hourly')
});

export const errorSchema = Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(50)
});