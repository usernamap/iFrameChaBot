// src/config/appConfig.ts
import { OpenAIConfig } from './openai';

export const AppConfig = {
    SERVER: {
        PORT: process.env.PORT || 4004,
        ENV: process.env.NODE_ENV || 'development',
    },
    DATABASE: {
        URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chatbot',
    },
    EMAIL: {
        ZOHO_EMAIL: process.env.ZOHO_EMAIL,
        ZOHO_PASSWORD: process.env.ZOHO_PASSWORD,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL
    },
    JWT: {
        SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
        EXPIRATION: '1h',
    },
    RATE_LIMIT: {
        WINDOW_MS: 15 * 60 * 1000, // 15 minutes
        MAX_REQUESTS: 100,
    },
    OPENAI: OpenAIConfig,
    SECURITY: {
        CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
        HELMET_CONFIG: {
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
                    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                    imgSrc: ["'self'", "data:", "https:"],
                    fontSrc: ["'self'", "https://fonts.gstatic.com"],
                    connectSrc: ["'self'", "https://api.openai.com"],
                },
            },
            referrerPolicy: {
                policy: 'strict-origin-when-cross-origin',
            },
        },
    },
    LOGGING: {
        LEVEL: process.env.LOG_LEVEL || 'info',
        FILE: process.env.LOG_FILE || 'app.log',
    },
};

export type AppConfigType = typeof AppConfig;
