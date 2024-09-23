// src/controllers/chatbotController.ts
import { Request, Response } from 'express';
import { OpenAIService } from '../services/openaiService';
import { ValidationUtils } from '../utils/validation';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';
import OpenAI from 'openai';

export class ChatbotController {
    static async chat(req: Request, res: Response): Promise<void> {
        const { message } = req.body;

        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            logger.warn('Invalid input received');
            res.status(400).json({ error: 'Invalid input' });
            return;
        }

        const cleanedMessage = ValidationUtils.sanitizeInput(message.trim().slice(0, 500));

        try {
            const reply = await OpenAIService.generateResponse(cleanedMessage);
            res.json({ message: reply });
        } catch (error) {
            logger.error('Chat error:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'An error occurred while processing your request' });
            }
        }
    }

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