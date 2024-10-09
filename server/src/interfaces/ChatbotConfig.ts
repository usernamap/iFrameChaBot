// src/interfaces/ChatbotConfig.ts

export interface ChatbotConfig {
    primaryColor: string;
    textColor: string;
    userMessageBackgroundColor: string;
    userMessageTextColor: string;
    botMessageBackgroundColor: string;
    botMessageTextColor: string;
    fontFamily: string;
    fontSize: string;
    enableTypingAnimation: boolean;
    typingAnimationType: string;
    typingText: string;
    typingLogo: string | null;
    typingAnimationColor: string;
    typingAnimationSize: number;
    mainBubbleLogo: string | null;
    openingBubbleColor: string;
    openingBubbleWidth: string;
    openingBubbleHeight: string;
    openingBubbleIcon: string;
    animateOpenClose: boolean;
    sendButtonIcon: string | null;
    darkModeSunLogo: string | null;
    darkModeMoonLogo: string | null;
    darkModeLogo: string | null;
    ttsLogo: string | null;
    welcomeMessage: string;
    headerTitle: string;
    headerSubtitle: string;
    enableStatus: boolean;
    statusConfig: {
        type: string;
        text: string;
        logo: string | null;
        dotStatus: string;
        dotColors: { [key: string]: string };
        textOffline: string;
        textAway: string;
        textOnline: string;
    };
    statusMessage: string;
    enableDarkMode: boolean;
    enableTTS: boolean;
    ttsConfig: {
        availableVoices: string[];
        enabledVoices: { [key: string]: boolean };
        defaultVoice: string;
        defaultSpeed: number;
        defaultVolume: number;
        enableSpeedControl: boolean;
        enableVolumeControl: boolean;
        delay: number;
        enableSpeed: boolean;
    };
    enableQuickReplies: boolean;
    quickReplies: string[];
    width: string | null;
    height: string | null;
    brandName: string;
    secondaryColor: string;
    buttonIcon: string | null;
    placeholderText: string;
    offlineText: string;
    loadingIcon: string | null;
    darkModeConfig: {
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
    };
    darkModeIcon: string | null;
    ERROR_MESSAGES: {
        network: string;
        timeout: string;
        rateLimit: string;
        server: string;
        unknown: string;
    };
    STATUS_COLORS: { [key: string]: string };
    STATUS_MESSAGES: { [key: string]: string };
    enableFeedback: boolean;
    feedbackProbability: number;
    enableSuggestions: boolean;
    enableAccessibility: boolean;
    accessibilityConfig: { [key: string]: boolean };
    avatarUrl: string;
    enableStatistics: boolean;
    statisticsConfig: {
        trackConversationLength: boolean;
        trackResponseTime: boolean;
        trackUserSatisfaction: boolean;
        trackTopics: boolean;
        trackUsagePatterns: boolean;
        reportingInterval: string;
        kpiThresholds: {
            averageResponseTime: number;
            userSatisfactionTarget: number;
            resolutionRateTarget: number;
            resolvedMessage: string;
            engagementRateTarget: number;
        };
    };
    ttsToggleIcon: string | null;
    ttsIcon: string | null;
    serverUrl: string;
    apiEndpoints: {
        chat: string;
        status: string;
        tts: string;
    };
    requestConfig: {
        timeout: number;
        maxRequestsPerMinute: number;
        minRequestInterval: number;
        initialBackoffTime: number;
    };
    mobileBreakpoint: string;
    messageConfig: { enableTimestamp: boolean; enableReadStatus: boolean };
    uiConfig: {
        chatWindowClass: string;
        mobileFullScreen: boolean;
        showCloseButton: boolean;
        showDarkModeToggle: boolean;
    };
    showStatus: boolean;
    statusText: string;
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