// src/controllers/authController.ts
import { Request, Response } from 'express';
import { IUser } from '../interfaces/User';
import User from '../models/User';
import { SecurityUtils } from '../utils/security';
import { ValidationUtils } from '../utils/validation';
import { AppError } from '../utils/AppError';
import { validateBody } from '../decorators/validate';
import logger from '../utils/logger';

export class AuthController {
    @validateBody({
        email: ValidationUtils.isValidEmail,
        password: ValidationUtils.isValidPassword,
    })
    static async login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AppError('User not found', 400);
            }

            const isMatch = await SecurityUtils.comparePasswords(password, user.password);
            if (!isMatch) {
                throw new AppError('Invalid credentials', 400);
            }

            const token = SecurityUtils.generateToken({ id: user._id });
            res.json({ token });
        } catch (error) {
            logger.error('Login error:', error);
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
        password: ValidationUtils.isValidPassword,
    })
    static async register(req: Request, res: Response): Promise<void> {
        const { name, email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (user) {
                throw new AppError('User already exists', 400);
            }

            const hashedPassword = await SecurityUtils.hashPassword(password);

            user = new User({
                name: ValidationUtils.sanitizeInput(name),
                email: ValidationUtils.sanitizeInput(email),
                password: hashedPassword,
            });

            await user.save();

            const token = SecurityUtils.generateToken({ id: user._id });
            res.json({ token });
        } catch (error) {
            logger.error('Registration error:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Server error' });
            }
        }
    }
}