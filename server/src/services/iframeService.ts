// src/services/iframeService.ts
import fs from 'fs/promises';
import path from 'path';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

export class IframeService {
  static async getIframeContent(): Promise<string> {
    const iframePath = path.join(__dirname, '../../public/iframe.html');
    try {
      return await fs.readFile(iframePath, 'utf8');
    } catch (error) {
      logger.error('Error reading iframe file:', error);
      throw new AppError('Failed to load iframe content', 500);
    }
  }

  static async getIframeScript(): Promise<string> {
    const scriptPath = path.join(__dirname, '../../public/iframe.js');
    try {
      return await fs.readFile(scriptPath, 'utf8');
    } catch (error) {
      logger.error('Error reading iframe script file:', error);
      throw new AppError('Failed to load iframe script', 500);
    }
  }
}