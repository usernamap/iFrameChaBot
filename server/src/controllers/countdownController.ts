import { Request, Response } from 'express';

let countdownEndTime: Date | null = null;

// Initialisation du compte à rebours
export const startCountdown = (req: Request, res: Response) => {
    const { hours = 0, minutes = 0, seconds = 0 } = req.body;

    // Validation des entrées
    if (hours < 0 || minutes < 0 || seconds < 0) {
        return res.status(400).json({ success: false, message: 'Invalid countdown values' });
    }

    const now = new Date();
    countdownEndTime = new Date(now.getTime() + (hours * 3600 + minutes * 60 + seconds) * 1000);

    return res.json({ success: true, countdownEndTime });
};


// Obtenir le temps restant
export const getCountdown = (req: Request, res: Response) => {
    if (!countdownEndTime) {
        return res.json({ success: false, message: 'Countdown not started.' });
    }

    const now = new Date();
    const timeRemaining = countdownEndTime.getTime() - now.getTime();

    if (timeRemaining <= 0) {
        countdownEndTime = null; // Réinitialiser après expiration
        return res.json({ hours: 0, minutes: 0, seconds: 0 });
    }

    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    return res.json({ hours, minutes, seconds });
};
