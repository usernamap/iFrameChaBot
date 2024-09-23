// src/config/appConfig.ts
import { OpenAIConfig } from './openai';

export const AppConfig = {
    SERVER: {
        PORT: process.env.PORT || 3002,
        ENV: process.env.NODE_ENV || 'development',
    },
    DATABASE: {
        URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chatbot',
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
    COMPANY_INFO: {
        phone: "pas de téléphone disponible",
        email: "pas d'email disponible",
        address: "pas d'adresse disponible",
        workingHours: "pas d'horaires disponibles",
        foundingYear: "pas d'année de fondation disponible",
        ceo: "pas de PDG disponible",
        employeeCount: "pas de nombre d'employés disponible",
        mainServices: [
            "Développement de sites web",
            "Applications mobiles",
            "Intégration d'IA",
            "SEO",
            "Design UX/UI"
        ],
        technologies: [
            "React", "Next.js", "Node.js", "Python", "TensorFlow", "AWS", "Docker",
            "Kubernetes", "MongoDB", "PostgreSQL", "GraphQL", "Tailwind CSS",
            "Framer Motion", "OpenAI", "Stripe", "Twilio", "SendGrid", "Firebase"
        ],
        clientSectors: [
            "E-commerce", "Fintech", "Santé", "Éducation", "Immobilier", "Tourisme",
            "Restauration", "Services professionnels", "Art et culture", "Associations",
            "Startups", "Agences de communication"
        ],
        socialMedia: {
            facebook: "page Facebook non disponible",
            twitter: "compte Twitter non disponible",
            linkedin: "profil LinkedIn non disponible",
            instagram: "compte Instagram non disponible",
        },
        awards: [
            "Meilleure Agence Web Innovante 2022",
            "Prix de l'Innovation Digitale 2023"
        ],
        certifications: [
            "Google Partner",
            "AWS Certified Solutions Architect",
            "ISO 27001"
        ]
    },
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