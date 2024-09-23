// src/interfaces/Conversation.ts
export interface IMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface IConversation {
    _id?: string;
    userId: string;
    messages: IMessage[];
    createdAt?: Date;
}