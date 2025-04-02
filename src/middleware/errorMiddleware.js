class ApiError extends Error {
    constructor(statusCode, message, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

const errorHandler = (err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: false,
        error: {
            code: err.statusCode,
            message: err.message,
            trackingId: req.correlationId
        }
    });
};

export { ApiError, errorHandler };