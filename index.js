import express from 'express';
import helmet from "helmet";
import cors from "cors";
import { rateLimit } from 'express-rate-limit'

const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
})

// Apply the rate limiting middleware to all requests
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use(cors());


app.use((req, res, next) => {
    res.setHeader('X-Powered-By', 'Mohamed Brzan');
    next();
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});