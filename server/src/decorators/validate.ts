// src/decorators/validate.ts
import { Request, Response, NextFunction } from 'express';
import { ValidationUtils } from '../utils/validation';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

export function validateBody(rules: { [key: string]: (value: any) => boolean }) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
            for (const [key, validate] of Object.entries(rules)) {
                if (!validate(req.body[key])) {
                    return res.status(400).json({ message: `Invalid ${key}` });
                }
            }
            try {
                await originalMethod.apply(this, [req, res, next]);
            } catch (error) {
                next(new AppError('Server error', 500));
            }
        };

        return descriptor;
    };
}



export function validateQuery(schema: Record<string, (value: any) => boolean>) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (req: Request, res: Response, next: NextFunction) {
            const errors: string[] = [];

            for (const [field, validator] of Object.entries(schema)) {
                if (!validator(req.query[field])) {
                    errors.push(`Invalid ${field} in query`);
                }
            }

            if (errors.length > 0) {
                logger.warn(`Query validation errors: ${errors.join(', ')}`);
                return next(new AppError(errors.join(', '), 400));
            }

            return originalMethod.apply(this, [req, res, next]);
        };

        return descriptor;
    };
}

export function validateParams(schema: Record<string, (value: any) => boolean>) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (req: Request, res: Response, next: NextFunction) {
            const errors: string[] = [];

            for (const [field, validator] of Object.entries(schema)) {
                if (!validator(req.params[field])) {
                    errors.push(`Invalid ${field} in params`);
                }
            }

            if (errors.length > 0) {
                logger.warn(`Params validation errors: ${errors.join(', ')}`);
                return next(new AppError(errors.join(', '), 400));
            }

            return originalMethod.apply(this, [req, res, next]);
        };

        return descriptor;
    };
}