import Joi from 'joi';

export const passwordComplexity = Joi.string()
    .min(12)
    .max(100)
    .pattern(/[A-Z]/, 'uppercase')
    .pattern(/[a-z]/, 'lowercase')
    .pattern(/[0-9]/, 'number')
    .pattern(/[^A-Za-z0-9]/, 'special character')
    .message(
        'Password must contain at least {#qty} characters including: ' +
        '1 uppercase, 1 lowercase, 1 number, and 1 special character'
    );

export const isValidDomain = (value, helpers) => {
    const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-]+\.){1,6}[a-zA-Z]{2,}$/;

    if (!domainRegex.test(value)) {
        return helpers.error('any.invalid');
    }

    if (forbiddenDomains.some(d => value.endsWith(d))) {
        return helpers.error('any.forbidden');
    }

    return value;
};