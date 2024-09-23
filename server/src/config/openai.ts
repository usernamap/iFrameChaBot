// src/config/openai.ts
import { ChatCompletionCreateParams, ChatCompletionMessageParam } from 'openai/resources/chat';
import { SpeechCreateParams } from 'openai/resources/audio';

export type OpenAIVoice = SpeechCreateParams['voice'];

export interface OpenAIConfig {
  API_KEY: string;
  CHAT: {
    MODEL: ChatCompletionCreateParams['model'];
    MAX_TOKENS: number;
    TEMPERATURE: number;
    TOP_P: number;
    FREQUENCY_PENALTY: number;
    PRESENCE_PENALTY: number;
    SYSTEM_MESSAGE: string | (() => string);
  };
  TTS: {
    MODEL: SpeechCreateParams['model'];
    VOICE: OpenAIVoice;
    SPEED: number;
  };
}

export const OpenAIConfig: OpenAIConfig = {
  API_KEY: process.env.OPENAI_API_KEY || 'votre_clé_api_par_défaut',
  CHAT: {
    MODEL: 'gpt-4',
    MAX_TOKENS: 150,
    TEMPERATURE: 0.7,
    TOP_P: 1,
    FREQUENCY_PENALTY: 0,
    PRESENCE_PENALTY: 0,
    SYSTEM_MESSAGE: () => {
      // Vous pouvez personnaliser cette fonction pour générer dynamiquement le message système
      return `Vous êtes l'assistant virtuel d'Aliatech, une agence de développement web innovante utilisant l'IA. Votre rôle est de fournir des informations précises et professionnelles sur les services d'Aliatech, de répondre aux questions des clients potentiels, et d'aider à la prise de rendez-vous. Vos réponses doivent être concises, informatives et refléter l'expertise d'Aliatech dans le domaine du développement web et de l'IA.`;
    },
  },
  TTS: {
    MODEL: 'tts-1',
    VOICE: 'nova',
    SPEED: 1,
  },
};

export type ChatConfig = Partial<typeof OpenAIConfig.CHAT>;
export type TTSConfig = Partial<typeof OpenAIConfig.TTS>;

export function getSystemMessage(): string {
  const systemMessage = OpenAIConfig.CHAT.SYSTEM_MESSAGE;
  return typeof systemMessage === 'function' ? systemMessage() : systemMessage;
}