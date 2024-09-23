// src/controllers/iframeController.ts
import { Request, Response } from 'express';
import { IframeService } from '../services/iframeService';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

export class IframeController {
  static async getIframe(req: Request, res: Response): Promise<void> {
    try {
      const iframeContent = await IframeService.getIframeContent();
      res.send(iframeContent);
    } catch (error) {
      logger.error('Error loading iframe:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).send('Error loading iframe');
      }
    }
  }

  static async getIframeScript(req: Request, res: Response): Promise<void> {
    try {
      const scriptContent = await IframeService.getIframeScript();
      res.type('application/javascript').send(scriptContent);
    } catch (error) {
      logger.error('Error loading iframe script:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).send('Error loading iframe script');
      }
    }
  }
}