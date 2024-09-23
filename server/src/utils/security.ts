// src/utils/security.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppConfig } from '../config/appConfig';
import { AppError } from './AppError';

export class SecurityUtils {
    static async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    static async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    static generateToken(payload: object, expiresIn: string = AppConfig.JWT.EXPIRATION): string {
        return jwt.sign(payload, AppConfig.JWT.SECRET, { expiresIn });
    }

    static verifyToken(token: string): any {
        try {
            return jwt.verify(token, AppConfig.JWT.SECRET);
        } catch (error) {
            throw new AppError('Invalid token', 401);
        }
    }
}