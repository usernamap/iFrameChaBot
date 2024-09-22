// src/chatbotConfig.js
const defaultConfig = {
  width: '350px',
  height: '800px',
  brandName: 'Aliatech',
  primaryColor: 'rgb(37 99 235 / 100%)',
  secondaryColor: '#1E40AF',
  fontFamily: "'Roboto', sans-serif",
  buttonIcon: '',
  headerTitle: 'Support Aliatech',
  placeholderText: "Tapez votre message...",
  offlineText: "L'assistant est hors ligne",
  sendButtonIcon: '',
  loadingIcon: '',
  typingText: 'L\'assistant est en train d\'écrire...',
  animateOpenClose: true,
  welcomeMessage: "Bonjour ! Vous avez des questions ?",
  enableDarkMode: true,
  darkModeConfig: {
    backgroundColor: '#333',
    textColor: '#fff',
    primaryColor: '#4A90E2',
    secondaryColor: '#6C757D',
  },
  ERROR_MESSAGES: {
    network: "Problème de connexion. Vérifiez votre connexion internet.",
    timeout: "La réponse a pris trop de temps. Réessayez plus tard.",
    rateLimit: "Trop de messages envoyés. Attendez un moment avant de réessayer.",
    server: "Problème technique de notre côté. Nous travaillons à le résoudre.",
    unknown: "Une erreur inattendue s'est produite. Veuillez réessayer."
  },
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
  enableFeedback: true,
  feedbackProbability: 0.2,
  enableSuggestions: true,
  quickReplies: [
    "Bonjour",
    "Comment ça va ?",
    "J'ai besoin d'aide",
  ],
  maxCustomSuggestions: 3,
  enableDynamicSuggestions: true,
  enableTypingAnimation: true,
  enableAccessibility: true,
  accessibilityConfig: {
    highContrast: false,
    largeText: false,
    screenReaderSupport: true
  },
  avatarUrl: '',
  enableAnalytics: true,
  analyticsConfig: {
    trackEvents: true,
    trackPageViews: true
  },
  enableTTS: true,
  ttsConfig: {
    availableVoices: ['nova', 'alloy', 'echo', 'fable', 'onyx', 'shimmer'], // Noms en minuscules
    defaultVoice: 'nova', // Définir la voix par défaut en minuscules
  },
  ttsToggleIcon: '', // Vous pouvez ajouter une icône personnalisée ici si nécessaire
};

export const getChatbotConfig = (customConfig = {}) => {
  const mergedConfig = { ...defaultConfig, ...customConfig };
  
  // Merge nested objects
  ['ERROR_MESSAGES', 'STATUS_COLORS', 'STATUS_MESSAGES', 'darkModeConfig', 'accessibilityConfig', 'analyticsConfig'].forEach(key => {
    mergedConfig[key] = { ...defaultConfig[key], ...customConfig[key] };
  });

  return mergedConfig;
};