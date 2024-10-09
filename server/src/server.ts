// src/server.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import connectDB from './config/database';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { AppConfig } from './config/appConfig';
import logger from './utils/logger';

dotenv.config();

const app = express();

// Connexion à la base de données
connectDB();

// Middlewares
app.use(cors({
    origin: AppConfig.SECURITY.CORS_ORIGIN,
    methods: 'GET, POST, PUT, DELETE, HEAD',
    allowedHeaders: 'Content-Type, Authorization',
}));
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'",
                "https://cdn.tailwindcss.com",
                "https://unpkg.com",
                "https://cdnjs.cloudflare.com"
            ],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://api.openai.com"],
        },
    },
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Servir les fichiers statiques du dossier public
app.use(express.static(path.join(__dirname, 'public')));
app.use('/iframes', express.static(path.join(__dirname, 'public/iframes')));

// Routes
app.use('/api', routes);

// Gestion des erreurs
app.use(errorHandler);

const PORT = AppConfig.SERVER.PORT;

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});

export default app;