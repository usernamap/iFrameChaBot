import express from 'express';
import { startCountdown, getCountdown } from '../controllers/countdownController';

const router = express.Router();

// Démarrer le compte à rebours
router.post('/startCountdown', startCountdown);

// Récupérer le temps restant
router.get('/countdown', getCountdown);

export default router;
