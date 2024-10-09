// src/routes/index.ts
import express from 'express';
import authRoutes from './auth';
import chatbotRoutes from './chatbot';
import iframeRoutes from './iframe';
import userRoutes from './user';
import countDownRoutes from './countdown';
import orderRoutes from './order';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/chatbot', chatbotRoutes);
router.use('/iframe', iframeRoutes);
router.use('/user', userRoutes);
router.use('/countdown', countDownRoutes);
router.use('/order', orderRoutes);



export default router;