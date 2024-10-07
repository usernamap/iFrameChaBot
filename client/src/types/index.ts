export interface Chatbot {
    id: string;
    name: string;
    description: string;
    config: ChatbotConfig;
}

export interface ChatbotConfig {
    primaryColor: string;
    textColor: string;
    userMessageBackgroundColor: string;
    userMessageTextColor: string;
    botMessageBackgroundColor: string;
    botMessageTextColor: string;
    fontFamily: string;
    fontSize: string;
    enableTypingAnimation?: boolean;
    typingAnimationType?: 'animation' | 'texte' | 'logo';
    typingText?: string;
    typingLogo?: File | string;
    typingAnimationColor?: string;
    typingAnimationSize?: number;
    mainBubbleLogo: string | null;
    openingBubbleColor?: string;
    openingBubbleWidth?: string;
    openingBubbleHeight?: string;
    openingBubbleIcon?: File | string;
    animateOpenClose?: boolean;
    sendButtonIcon?: File | string;
    darkModeSunLogo?: File | string;
    darkModeMoonLogo?: File | string;

    ttsLogo?: File | string;

    darkModeLogo?: File | string;

    welcomeMessage: string;
    headerTitle: string;
    headerSubtitle: string;
    statusMessage: string;

    enableDarkMode: boolean;
    enableTTS: boolean;
    ttsConfig: TTSConfig;
    enableQuickReplies: boolean;
    quickReplies: string[];

    width: string | null;
    height: string | null;
    brandName: string;
    secondaryColor: string;
    buttonIcon: React.ReactNode | null;
    placeholderText: string;
    offlineText: string;
    loadingIcon: React.ReactNode | null;

    darkModeConfig: DarkModeConfig;
    darkModeIcon: string | null;

    ERROR_MESSAGES: ErrorMessages;
    STATUS_COLORS: StatusColors;
    STATUS_MESSAGES: StatusMessages;

    enableFeedback: boolean;
    feedbackProbability: number;

    enableSuggestions: boolean;

    enableAccessibility: boolean;
    accessibilityConfig: AccessibilityConfig;

    avatarUrl: string;

    enableStatistics: boolean;
    statisticsConfig: StatisticsConfig;

    ttsToggleIcon: React.ReactNode | null;
    ttsIcon: string | null;

    serverUrl: string;
    apiEndpoints: ApiEndpoints;

    requestConfig: RequestConfig;

    mobileBreakpoint: string;

    messageConfig: MessageConfig;

    uiConfig: UIConfig;

    showStatus: boolean;
    statusText: string;
    enableStatus: boolean;
    statusConfig: {
        dotColors: {
            online: string;
            away: string;
            offline: string;
        };
        textOffline: string;
        textAway: string;
        textOnline: string;
        type: 'dot' | 'logo' | 'text';
        logo?: File;
        text?: string;
        dotStatus?: 'online' | 'away' | 'offline';
    };
}

export interface TypingAnimationConfig {
    typingAnimationType?: 'animation' | 'texte' | 'logo';
    typingText?: string;
    typingLogo?: File | string;
    typingAnimationColor?: string;
    typingAnimationSize?: number;
}

export interface TTSConfig {
    availableVoices: string[];
    enabledVoices: {
        [key: string]: boolean;
    };
    defaultVoice: string;
    defaultSpeed: number;
    defaultVolume: number;
    delay: number;
    enableSpeed: boolean;
    enableSpeedControl: boolean;
    enableVolumeControl: boolean;
}


export interface DarkModeConfig {
    backgroundColor: string;
    textColor: string;
    primaryColor: string;
    secondaryColor: string;
    inputBackgroundColor: string;
    inputTextColor: string;
    buttonBackgroundColor: string;
    buttonTextColor: string;
    messageBackgroundColor: string;
    messageTextColor: string;
    userMessageBackgroundColor: string;
    userMessageTextColor: string;
    suggestionBackgroundColor: string;
    suggestionTextColor: string;
    feedbackBackgroundColor: string;
    feedbackTextColor: string;
}

export interface ErrorMessages {
    network: string;
    timeout: string;
    rateLimit: string;
    server: string;
    unknown: string;
}

export interface StatusColors {
    online: string;
    away: string;
    offline: string;
}

export interface StatusMessages {
    online: string;
    away: string;
    offline: string;
}

export interface AccessibilityConfig {
    highContrast: boolean;
    largeText: boolean;
    screenReaderSupport: boolean;
}

export interface StatisticsConfig {
    trackConversationLength: boolean;
    trackResponseTime: boolean;
    trackUserSatisfaction: boolean;
    trackTopics: boolean;
    trackUsagePatterns: boolean;
    reportingInterval: 'daily' | 'weekly' | 'monthly';
    kpiThresholds: {
        averageResponseTime: number;
        userSatisfactionTarget: number;
        resolutionRateTarget: number;
        resolvedMessage: string;
        engagementRateTarget: number;
    };
}

export interface ApiEndpoints {
    chat: string;
    status: string;
    tts: string;
}

export interface RequestConfig {
    timeout: number;
    maxRequestsPerMinute: number;
    minRequestInterval: number;
    initialBackoffTime: number;
}

export interface MessageConfig {
    enableReadStatus: boolean;
    enableTimestamp: boolean;
}

export interface UIConfig {
    chatWindowClass: string;
    mobileFullScreen: boolean;
    showCloseButton: boolean;
    showDarkModeToggle: boolean;
}

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface ApiError {
    message: string;
    code?: string;
}

export interface CompanyInfo {
    name: string;
    industry: string;
    description: string;
    location: string;
    website: string;
    contact: {
        phone: string;
        email: string;
    };
    services: string[];
    targetAudience: string[];
    competitors: string[];
    brandVoice: string;
    frequentlyAskedQuestions: string[];
    values: string[];
    socialMediaLinks: {
        facebook: string;
        twitter: string;
        linkedin: string;
        instagram: string;
    };
    policies: {
        privacyPolicy: string;
        returnPolicy: string;
        termsOfService: string;
    };
    testimonials: string[];
    team: TeamMember[];
    locationDetails: LocationDetails;
    otherInfo?: {
        companyHistory?: string;
        companyCulture?: string;
        certificationsAwards?: string[];
        futureProjects?: string[];
        additionalInfo?: string;
    };
}

export interface TeamMember {
    name: string;
    position: string;
    bio: string;
}

export interface LocationDetails {
    mainOffice: Office;
    branches: Office[];
}

export interface Office {
    address: string;
    hours: string[];
}

export interface FormData extends Omit<ChatbotConfig, 'companyInfo'> {
    companyInfo: CompanyInfo;
}

export interface SupportPlan {
    name: string;
    price: number;
    features: string[];
}

export interface Message {
    id: string;
    text: string;
    isBot: boolean;
    timestamp: Date;
}

export interface CompanyInfoStepsProps {
    companyInfo: CompanyInfo;
    updateCompanyInfo: (updates: Partial<CompanyInfo>) => void;
    onComplete: () => void;
}