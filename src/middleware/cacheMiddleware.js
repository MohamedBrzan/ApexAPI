// A simple in-memory cache store
const memoryCache = new Map();

export const cacheMiddleware = (defaultTTL = 300) => (req, res, next) => {
    const key = `cache:${req.originalUrl}`;

    // Bypass cache if header is present
    if (req.headers['x-cache-bypass'] === 'true') {
        return next();
    }

    // Check if the key exists and is not expired
    const cachedEntry = memoryCache.get(key);
    if (cachedEntry && cachedEntry.expire > Date.now()) {
        return res.json(cachedEntry.data);
    } else if (cachedEntry) {
        // Remove expired cache entry
        memoryCache.delete(key);
    }

    // Override res.json to cache the response before sending it
    const originalJson = res.json.bind(res);
    res.json = (body) => {
        const ttl = (req.cacheTTL || defaultTTL) * 1000; // Convert TTL from seconds to milliseconds
        memoryCache.set(key, { data: body, expire: Date.now() + ttl });
        originalJson(body);
    };

    next();
};
