import Joi from 'joi';

export const createWarehouseSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    location: Joi.object({
        address: Joi.string().required(),
        city: Joi.string().required(),
        country: Joi.string().required(),
        coordinates: Joi.object({
            lat: Joi.number().min(-90).max(90),
            lng: Joi.number().min(-180).max(180)
        })
    }).required(),
    capacity: Joi.object({
        total: Joi.number().min(1).required()
    }).required()
});