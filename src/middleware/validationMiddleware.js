import { validationResult } from 'express-validator';
import { logger } from './logging.js';

export const validate = (validations) => async (req, res, next) => {
    if (Array.isArray(validations)) {
        await Promise.all(validations.map(validation => validation.run(req)));
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn('Validation failed', {
            path: req.path,
            errors: errors.array()
        });

        return res.status(422).json({
            error: 'Validation Error',
            details: errors.array().map(err => ({
                param: err.param,
                message: err.msg,
                location: err.location
            }))
        });
    }

    next();
};
