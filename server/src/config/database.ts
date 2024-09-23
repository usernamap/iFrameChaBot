// src/config/database.ts
import mongoose from 'mongoose';
import { AppConfig } from './appConfig';
import logger from '../utils/logger';

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(AppConfig.DATABASE.URI);
        logger.info(`MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
        logger.error(`Error: ${(error as Error).message}`);
        process.exit(1);
    }
};

export default connectDB;