// src/routes/chatbot.ts
import express from 'express';
import { ChatbotController } from '../controllers/chatbotController';
import rateLimiter from '../middleware/rateLimiter';

const router = express.Router();

router.post('/chat', rateLimiter, ChatbotController.chat);
router.get('/status', ChatbotController.getStatus);
router.post('/tts', rateLimiter, ChatbotController.tts);

export default router;