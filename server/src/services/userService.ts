// src/services/userService.ts
import { ClientSession } from 'mongodb';
import User from '../models/User';
import Conversation from '../models/Conversation';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

export class UserService {
  static async deleteUserAndConversations(userId: string): Promise<void> {
    const session: ClientSession = await User.startSession();
    session.startTransaction();

    try {
      const deletedUser = await User.findByIdAndDelete(userId).session(session);
      if (!deletedUser) {
        throw new AppError('User not found', 404);
      }

      await Conversation.deleteMany({ userId }).session(session);

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      logger.error('Error deleting user and conversations:', error);
      throw error;
    } finally {
      session.endSession();
    }
  }
}