import { Request, Response, NextFunction } from 'express';
import orderService from '../services/orderService';
import emailService from '../services/emailService';
import iframeGeneratorService from '../services/iframeGeneratorService';
import { AppError } from '../utils/AppError';

class OrderController {
    public async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { chatbotConfig, companyInfo, selectedSubscription, orderNumber } = req.body;

            if (!chatbotConfig || !companyInfo || !selectedSubscription || !orderNumber) {
                throw new AppError('Données de commande invalides', 400);
            }

            const existingOrder = await orderService.getOrderByNumber(orderNumber);
            if (existingOrder) {
                throw new AppError('Le numéro de commande existe déjà', 400);
            }

            const newOrder = await orderService.createOrder({
                chatbotConfig,
                companyInfo,
                selectedSubscription,
                orderNumber
            });

            // Envoyer un e-mail de notification
            await emailService.sendOrderNotification(newOrder);

            // Générer l'iframe
            const iframeUrl = await iframeGeneratorService.generateIframe(newOrder);

            res.status(201).json({
                message: 'Commande créée avec succès',
                order: newOrder,
                iframeUrl: iframeUrl
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new OrderController();