// src/services/openaiService.ts
import OpenAI from 'openai';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';
import { OpenAIConfig, ChatConfig, TTSConfig, getSystemMessage } from '../config/openai';
import Company from '../models/Company'; // Assurez-vous que le modèle Company est correctement exporté
import { CompanyInfo } from '../interfaces/CompanyInfo';

const openai = new OpenAI({
    apiKey: OpenAIConfig.API_KEY,
});

export class OpenAIService {
    static async generateResponse(message: string, companyInfo: CompanyInfo, config: ChatConfig = {}): Promise<string> {
        try {
            const mergedConfig = { ...OpenAIConfig.CHAT, ...config };
            const systemMessage = getSystemMessage(companyInfo);
            const chatCompletion = await openai.chat.completions.create({
                model: mergedConfig.MODEL,
                messages: [
                    { role: "system", content: systemMessage },
                    { role: "user", content: message }
                ],
                max_tokens: mergedConfig.MAX_TOKENS,
                temperature: mergedConfig.TEMPERATURE,
                top_p: mergedConfig.TOP_P,
                frequency_penalty: mergedConfig.FREQUENCY_PENALTY,
                presence_penalty: mergedConfig.PRESENCE_PENALTY,
            });

            const reply = chatCompletion.choices[0].message?.content;
            if (!reply) {
                throw new Error('Empty response from OpenAI');
            }
            return reply;
        } catch (error) {
            logger.error('Error generating OpenAI response:', error);
            if (error instanceof OpenAI.APIError) {
                if (error.status === 401) {
                    throw new AppError('Unauthorized access to AI service', 401);
                } else if (error.status === 429) {
                    throw new AppError('AI service quota exceeded', 429);
                }
            }
            throw new AppError('Failed to generate AI response', 500);
        }
    }

    static async generateTTS(text: string, voice: string): Promise<Buffer> {
        try {
            const response = await openai.audio.speech.create({
                model: OpenAIConfig.TTS.MODEL,
                voice: voice as "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer",
                input: text,
            });

            const buffer = Buffer.from(await response.arrayBuffer());
            return buffer;
        } catch (error) {
            logger.error('Error generating TTS:', error);
            if (error instanceof OpenAI.APIError) {
                throw new AppError(`OpenAI API Error: ${error.message}`, error.status ?? 500);
            }
            throw new AppError('Failed to generate TTS', 500);
        }
    }

    static async checkStatus(): Promise<void> {
        try {
            await openai.models.list();
        } catch (error) {
            if (error instanceof OpenAI.APIError) {
                throw error;
            } else {
                throw new AppError('Error checking OpenAI service status', 500);
            }
        }
    }

    static async saveCompanyData(companyInfo: CompanyInfo): Promise<void> {
        try {
            await Company.findOneAndUpdate(
                { name: companyInfo.name }, // Utilisez un identifiant unique approprié
                companyInfo,
                { upsert: true, new: true }
            );
            logger.info(`Company data saved for ${companyInfo.name}`);
        } catch (error) {
            logger.error('Error saving company data:', error);
            throw new AppError('Failed to save company data', 500);
        }
    }
}
