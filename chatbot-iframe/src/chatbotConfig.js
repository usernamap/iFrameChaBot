// src/chatbotConfig.js
const defaultConfig = {
  // Paramètres généraux
  width: null,
  height: null,
  brandName: 'Aliatech',
  primaryColor: 'rgb(37 99 235 / 100%)',
  secondaryColor: '#1E40AF',
  fontFamily: "'Roboto', sans-serif",
  buttonIcon: null, // Vous pouvez définir une icône personnalisée ici
  headerTitle: 'Support Aliatech',
  placeholderText: "Tapez votre message...",
  offlineText: "L'assistant est hors ligne",
  sendButtonIcon: null, // Vous pouvez définir une icône personnalisée ici
  loadingIcon: null, // Vous pouvez définir une icône personnalisée ici
  animateOpenClose: true,
  welcomeMessage: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",

  // Configuration du mode sombre
  enableDarkMode: true,
  darkModeConfig: {
    backgroundColor: '#333',
    textColor: '#fff',
    primaryColor: '#4A90E2',
    secondaryColor: '#6C757D',
    inputBackgroundColor: '#444',
    inputTextColor: '#fff',
    buttonBackgroundColor: '#4A90E2',
    buttonTextColor: '#fff',
    messageBackgroundColor: '#444',
    messageTextColor: '#fff',
    userMessageBackgroundColor: '#4A90E2',
    userMessageTextColor: '#fff',
    suggestionBackgroundColor: '#4A90E2',
    suggestionTextColor: '#fff',
    feedbackBackgroundColor: '#444',
    feedbackTextColor: '#fff',
  },

  // Messages d'erreur
  ERROR_MESSAGES: {
    network: "Problème de connexion. Vérifiez votre connexion internet.",
    timeout: "La réponse a pris trop de temps. Réessayez plus tard.",
    rateLimit: "Trop de messages envoyés. Attendez un moment avant de réessayer.",
    server: "Problème technique de notre côté. Nous travaillons à le résoudre.",
    unknown: "Une erreur inattendue s'est produite. Veuillez réessayer."
  },

  // Couleurs et messages de statut
  STATUS_COLORS: {
    online: 'bg-green-400',
    away: 'bg-orange-400',
    offline: 'bg-red-400'
  },
  STATUS_MESSAGES: {
    online: "L'assistant est en ligne",
    away: "L'assistant est absent",
    offline: "L'assistant est hors ligne"
  },

  // Configuration du feedback
  enableFeedback: true,
  feedbackProbability: 0.3, // Probabilité d'afficher le formulaire de feedback (30%)

  // Configuration des suggestions
  enableSuggestions: true,
  quickReplies: [
    "En quoi tu peut m'aider ?",
    "J'ai une question sur un produit",
  ],

  // Animation de frappe
  enableTypingAnimation: true,
  typingText: 'L\'assistant est en train d\'écrire...',

  // Configuration d'accessibilité
  enableAccessibility: true,
  accessibilityConfig: {
    highContrast: false,
    largeText: false,
    screenReaderSupport: true
  },

  // Avatar
  avatarUrl: '', // URL de l'avatar de l'assistant

  // Configuration des analyses
  enableStatistics: true,
  statisticsConfig: {
    trackConversationLength: true,
    trackResponseTime: true,
    trackUserSatisfaction: true,
    trackTopics: true,
    trackUsagePatterns: true,
    reportingInterval: 'daily', // 'daily', 'weekly', 'monthly'
    kpiThresholds: {
      averageResponseTime: 5000, // en millisecondes
      userSatisfactionTarget: 4.5, // sur 5
      resolutionRateTarget: 0.8, // 80%
      resolvedMessage: 'Ravi d\'avoir pu vous aider ! N\'hésitez pas si vous avez d\'autres questions.',
      engagementRateTarget: 0.6, // 60%
    },
  },

  // Configuration TTS (Text-to-Speech)
  enableTTS: true,
  ttsConfig: {
    availableVoices: ['nova', 'alloy', 'echo', 'fable', 'onyx', 'shimmer'],
    defaultVoice: 'nova',
    defaultVolume: 1,
    defaultSpeed: 1,
    delay: 500, // Délai avant le démarrage de la lecture audio (en ms)
  },
  ttsToggleIcon: null, // Vous pouvez définir une icône personnalisée ici

  // Configuration du serveur
  serverUrl: 'http://localhost:3002',
  apiEndpoints: {
    chat: '/api/chatbot/chat',
    status: '/api/chatbot/status',
    tts: '/api/chatbot/tts'
  },

  // Configuration des requêtes
  requestConfig: {
    timeout: 30000,
    maxRequestsPerMinute: 60,
    minRequestInterval: 1000,
    initialBackoffTime: 1000,
  },

  // Configuration mobile
  mobileBreakpoint: '768px',

  // Configuration des messages
  messageConfig: {
    enableReadStatus: true,
    enableTimestamp: true,
  },

  // Configuration de l'interface utilisateur
  uiConfig: {
    chatWindowClass: 'fixed bottom-20 right-4 w-96',
    mobileFullScreen: true,
    showCloseButton: true,
    showDarkModeToggle: true,
  },
};

export const getChatbotConfig = (customConfig = {}) => {
  const mergedConfig = { ...defaultConfig, ...customConfig };
  
  // Fusion des objets imbriqués
  [
    'ERROR_MESSAGES', 
    'STATUS_COLORS', 
    'STATUS_MESSAGES', 
    'darkModeConfig', 
    'accessibilityConfig', 
    'statisticsConfig',
    'ttsConfig',
    'apiEndpoints',
    'requestConfig',
    'messageConfig',
    'uiConfig'
  ].forEach(key => {
    if (customConfig[key]) {
      mergedConfig[key] = { ...defaultConfig[key], ...customConfig[key] };
    }
  });

  return mergedConfig;
};

export default getChatbotConfig;