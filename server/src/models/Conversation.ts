// src/models/Conversation.ts
import mongoose, { Schema } from 'mongoose';
import { IConversation } from '../interfaces/Conversation';

const ConversationSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [{ 
    role: { type: String, enum: ['system', 'user', 'assistant'], required: true },
    content: { type: String, required: true }
  }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IConversation>('Conversation', ConversationSchema);