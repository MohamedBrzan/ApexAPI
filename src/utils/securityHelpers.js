

// Custom SKU validation
export const isValidSKU = (value, helpers) => {
    if (!/^[A-Z]{3}-\d{3}-[A-Z0-9]{3}$/.test(value)) {
        return helpers.error('any.invalid');
    }
    return value;
};