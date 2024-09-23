// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { SecurityUtils } from '../utils/security';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

const auth = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header('x-auth-token');

  if (!token) {
    throw new AppError('No token, authorization denied', 401);
  }

  try {
    const decoded = SecurityUtils.verifyToken(token);
    (req as any).user = decoded;
    next();
  } catch (err) {
    logger.error('Authentication error:', err);
    throw new AppError('Token is not valid', 401);
  }
};

export default auth;