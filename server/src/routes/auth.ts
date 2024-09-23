// src/routes/auth.ts
import express from 'express';
import { AuthController } from '../controllers/authController';
import rateLimiter from '../middleware/rateLimiter';

const router = express.Router();

router.post('/login', rateLimiter, AuthController.login);
router.post('/register', rateLimiter, AuthController.register);

export default router;