// src/routes/index.ts
import express from 'express';
import authRoutes from './auth';
import chatbotRoutes from './chatbot';
import iframeRoutes from './iframe';
import userRoutes from './user';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/chatbot', chatbotRoutes);
router.use('/iframe', iframeRoutes);
router.use('/user', userRoutes);



export default router;