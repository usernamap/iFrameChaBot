// src/routes/order.ts

import { Router } from 'express';
import orderController from '../controllers/orderController';
import { body } from 'express-validator';
import validate from '../middleware/validate';

const router = Router();

router.post(
    '/order',
    [
        body('chatbotConfig').notEmpty(),
        body('companyInfo').notEmpty(),
        body('selectedSubscription').notEmpty(),
        body('orderNumber').isString().notEmpty()
    ],
    validate,
    orderController.createOrder
);

export default router;
