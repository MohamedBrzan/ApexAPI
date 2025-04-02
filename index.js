import express from 'express';
import helmet from "helmet";
import cors from "cors";
import dotenv from 'dotenv';
import DBConnection from './src/config/database/DBConnection.js';
import rateLimiting from './src/middleware/rateLimiting.js';
import { requestLogger } from './src/middleware/logging.js';
import mainRouter from './src/routes/index.js';
import compression from 'compression';

const PORT = process.env.PORT || 3000;

const app = express();

dotenv.config();
// connect to the database
DBConnection();


// =====================
// Security Middleware
// =====================
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGINS.split(','),
    methods: process.env.CORS_METHODS.split(','),
    allowedHeaders: process.env.CORS_HEADERS.split(','),
    exposedHeaders: process.env.CORS_EXPOSE_HEADERS.split(','),
    maxAge: process.env.CORS_MAX_AGE,
    credentials: process.env.CORS_CREDENTIALS === 'true',
    optionsSuccessStatus: 200,
    preflightContinue: false,
}));

// =====================
// Performance Middleware
// =====================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
// Performance middleware
app.use(compression());


// =====================
// Request Logging
// =====================
// Middleware for logging requests
app.use(requestLogger);


// =====================
// API Routes
// =====================
app.use('/', mainRouter); // Mount all routes under /api base path



// Apply the rate limiting middleware to all requests
app.use(rateLimiting);




app.use((req, res, next) => {
    res.setHeader('X-Powered-By', 'Mohamed Brzan');
    next();
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;