import winston from 'winston';
// Create a logger instance
const logger = winston.createLogger({
    level: 'info', // Default log level
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(), // Log to console
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Log errors to file
        new winston.transports.File({ filename: 'logs/combined.log' }) // Log all levels to file
    ]
});

// Middleware to log requests
const requestLogger = (req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
};

export { logger, requestLogger };