// src/middleware/validate.ts

import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AppError } from '../utils/AppError';

const validate = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new AppError('Validation des données échouée', 400));
    }
    next();
};

export default validate;
