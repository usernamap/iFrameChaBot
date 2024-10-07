// src/controllers/chatbotController.ts

import { Request, Response } from 'express';
import { OpenAIService } from '../services/openaiService';
import { ValidationUtils } from '../utils/validation';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';
import { CompanyInfo } from '../interfaces/CompanyInfo';
import OpenAI from 'openai';

export class ChatbotController {
    // Gestion des requêtes HEAD
    static async headChat(req: Request, res: Response): Promise<void> {
        logger.info('Received HEAD request for /api/chatbot/chat', { timestamp: new Date().toISOString() });
        res.status(200).end();
    }

    // Gestion des requêtes POST
    static async chat(req: Request, res: Response): Promise<void> {
        logger.info('Received POST request for /api/chatbot/chat', { timestamp: new Date().toISOString() });
        const { message, companyInfo, chatbotConfig } = req.body;

        logger.info('message:', message);
        logger.info('companyInfo:', companyInfo);
        logger.info('chatbotConfig:', chatbotConfig);

        // Validation du message
        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            logger.warn('Invalid input received');
            res.status(400).json({ error: 'Invalid input' });
            return;
        }

        // Validation et nettoyage du message
        const cleanedMessage = ValidationUtils.sanitizeInput(message.trim().slice(0, 500));

        // Validation de companyInfo
        if (!companyInfo || typeof companyInfo !== 'object') {
            logger.warn('Invalid companyInfo received');
            res.status(400).json({ error: 'Invalid companyInfo' });
            return;
        }

        try {
            // Sauvegarder les données de l'entreprise
            await OpenAIService.saveCompanyData(companyInfo as CompanyInfo);

            // Génération de la réponse en utilisant le service OpenAI
            const reply = await OpenAIService.generateResponse(cleanedMessage, companyInfo as CompanyInfo, chatbotConfig);

            // Réponse au client avec la clé 'response'
            res.json({ response: reply });
        } catch (error) {
            logger.error('Chat error:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'An error occurred while processing your request' });
            }
        }
    }

    /**
     * Gère les requêtes GET pour vérifier le statut du chatbot.
     */
    static async getStatus(req: Request, res: Response): Promise<void> {
        try {
            await OpenAIService.checkStatus();
            res.json({ status: 'online' });
        } catch (error) {
            logger.error('Status check error:', error);
            if (error instanceof OpenAI.APIError) {
                res.status(500).json({
                    status: 'offline',
                    error: 'Problème de connexion avec OpenAI',
                    details: `${error.status}: ${error.message}`
                });
            } else {
                res.status(500).json({
                    status: 'offline',
                    error: 'Erreur interne du serveur',
                    details: (error as Error).message
                });
            }
        }
    }

    /**
     * Gère les requêtes POST pour la synthèse vocale (TTS).
     */
    static async tts(req: Request, res: Response): Promise<void> {
        const { text, voice } = req.body;

        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            logger.warn('Invalid input received');
            res.status(400).json({ error: 'Invalid input' });
            return;
        }

        const cleanedText = ValidationUtils.sanitizeInput(text.trim().slice(0, 1000));
        const cleanedVoice = voice?.toLowerCase() || 'alloy';  // Utilisation d'une voix par défaut si non spécifiée

        try {
            const audioBuffer = await OpenAIService.generateTTS(cleanedText, cleanedVoice);
            res.setHeader('Content-Type', 'audio/mpeg');
            res.send(audioBuffer);
        } catch (error) {
            logger.error('TTS error:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'An error occurred while processing your request' });
            }
        }
    }
}
