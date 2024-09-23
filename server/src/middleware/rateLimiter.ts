// src/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';
import { AppConfig } from '../config/appConfig';

const rateLimiter = rateLimit({
    windowMs: AppConfig.RATE_LIMIT.WINDOW_MS,
    max: AppConfig.RATE_LIMIT.MAX_REQUESTS,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please try again later.',
});

export default rateLimiter;