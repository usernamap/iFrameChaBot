// src/config/openai.ts
import { ChatCompletionCreateParams, ChatCompletionMessageParam } from 'openai/resources/chat';
import { SpeechCreateParams } from 'openai/resources/audio';
import { CompanyInfo } from '../interfaces/CompanyInfo';

export const OpenAIConfig: OpenAIConfig = {
  API_KEY: process.env.OPENAI_API_KEY || 'votre_clé_api_par_défaut',
  CHAT: {
    MODEL: 'gpt-4',
    MAX_TOKENS: 150,
    TEMPERATURE: 0.7,
    TOP_P: 1,
    FREQUENCY_PENALTY: 0,
    PRESENCE_PENALTY: 0,
    SYSTEM_MESSAGE: (companyInfo: CompanyInfo) => {
      const services = companyInfo.services?.join(', ') || 'Aucun service défini';
      const targetAudience = companyInfo.targetAudience?.join(', ') || 'Aucune audience cible définie';
      const competitors = companyInfo.competitors?.join(', ') || 'Aucun concurrent défini';
      const socialMediaLinks = Object.entries(companyInfo.socialMediaLinks || {})
        .map(([platform, url]) => `${platform}: ${url}`)
        .join(', ') || 'Aucun lien de médias sociaux défini';
      const policies = Object.entries(companyInfo.policies || {})
        .map(([policy, content]) => `${policy}: ${content}`)
        .join(', ') || 'Aucune politique définie';
      const otherInfo = Object.entries(companyInfo.otherInfo || {})
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ') || 'Aucune information supplémentaire définie';

      return `Vous êtes l'assistant virtuel de ${companyInfo.name}, une entreprise de ${companyInfo.industry}. Votre contexte inclut les services suivants : ${services}. L'audience cible est : ${targetAudience}. Les concurrents sont : ${competitors}. Les liens de médias sociaux sont : ${socialMediaLinks}. Les politiques de l'entreprise sont : ${policies}. Informations supplémentaires : ${otherInfo}. Votre rôle est de fournir des informations précises et professionnelles sur les services de ${companyInfo.name}, de répondre aux questions des clients potentiels, et d'aider à la prise de rendez-vous. Vos réponses doivent être concises, informatives et refléter l'expertise de ${companyInfo.name}.`;
    },
  },
  TTS: {
    MODEL: 'tts-1',
    VOICE: 'nova',
    SPEED: 1,
  },
};

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
    SYSTEM_MESSAGE: (companyInfo: CompanyInfo) => string;
  };
  TTS: {
    MODEL: SpeechCreateParams['model'];
    VOICE: OpenAIVoice;
    SPEED: number;
  };
}



export type ChatConfig = Partial<typeof OpenAIConfig.CHAT>;
export type TTSConfig = Partial<typeof OpenAIConfig.TTS>;

/**
 * Génère le message système basé sur les informations de l'entreprise.
 * @param companyInfo Les informations de l'entreprise.
 * @returns Le message système généré.
 */
export function getSystemMessage(companyInfo: CompanyInfo): string {
  const systemMessage = OpenAIConfig.CHAT.SYSTEM_MESSAGE;
  return typeof systemMessage === 'function' ? systemMessage(companyInfo) : systemMessage;
}