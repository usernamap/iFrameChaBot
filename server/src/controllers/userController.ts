// src/controllers/userController.ts
import { Request, Response } from 'express';
import { IUser } from '../interfaces/User';
import User from '../models/User';
import { AppError } from '../utils/AppError';
import { validateBody } from '../decorators/validate';
import { ValidationUtils } from '../utils/validation';
import logger from '../utils/logger';

export class UserController {
    static async getUser(req: Request, res: Response): Promise<void> {
        try {
            const user = await User.findById((req as any).user.id).select('-password');
            if (!user) {
                throw new AppError('User not found', 404);
            }
            res.json(user);
        } catch (error) {
            logger.error('Get user error:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Server error' });
            }
        }
    }

    @validateBody({
        name: (name: string) => name.length > 0,
        email: ValidationUtils.isValidEmail,
    })
    static async updateUser(req: Request, res: Response): Promise<void> {
        const { name, email } = req.body;

        try {
            const user = await User.findByIdAndUpdate(
                (req as any).user.id,
                {
                    name: ValidationUtils.sanitizeInput(name),
                    email: ValidationUtils.sanitizeInput(email)
                },
                { new: true }
            ).select('-password');

            if (!user) {
                throw new AppError('User not found', 404);
            }

            res.json(user);
        } catch (error) {
            logger.error('Update user error:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Server error' });
            }
        }
    }
}