import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/index';
import { ChatbotConfig } from '@/types/index';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ChatbotCustomization from '@/components/customize/ChatbotCustomization';
import ChatbotPreview from '@/components/customize/ChatbotPreview';
import ClientOnly from '../components/ClientOnly';
import usePersistedState from '../contexts/usePersistedState';
import { RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { Icons } from '@/components/common/Icons';

const defaultConfig: ChatbotConfig = {
    // Général
    // Apparence
    primaryColor: '#2564eb',
    textColor: '#ffffff',
    userMessageBackgroundColor: '#2564eb',
    userMessageTextColor: '#FFFFFF',
    botMessageBackgroundColor: '#e5e7eb',
    botMessageTextColor: '#333333',
    fontFamily: "",
    fontSize: '14px',
    enableTypingAnimation: true,
    typingAnimationType: 'animation',
    typingText: "L'assistant est en train d'écrire...",
    typingLogo: null,
    typingAnimationColor: '#6b7280',
    typingAnimationSize: 8,
    mainBubbleLogo: null,
    openingBubbleColor: '#1D4ED8', // blue-700
    openingBubbleWidth: '50px',
    openingBubbleHeight: '50px',
    openingBubbleIcon: '', // Chemin vers une icône par défaut ou vide
    animateOpenClose: true,
    sendButtonIcon: null,
    darkModeSunLogo: null,
    darkModeMoonLogo: null,
    darkModeLogo: null,
    // Nouvelle propriété
    ttsLogo: null,

    // Messages
    welcomeMessage: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
    headerTitle: "Assistant Aliatech",
    headerSubtitle: "Votre assistant virtuel",
    enableStatus: true,
    statusConfig: {
        type: 'dot',  // Modification pour ajouter la nouvelle option de "pastille" par défaut
        text: "En ligne",
        logo: null,
        dotStatus: 'online',  // Nouvelle propriété pour gérer le statut de la pastille
        dotColors: {
            online: '#45FF00',   // Correspondant à "bg-green-400"
            away: '#FFA500',     // Correspondant à "bg-orange-400"
            offline: '#FF0000'   // Correspondant à "bg-red-400"
        },
        textOffline: "Hors ligne",
        textAway: "Absent",
        textOnline: "En ligne"
    },
    statusMessage: "En ligne",

    // Fonctionnalités
    enableDarkMode: false,
    enableTTS: false,
    ttsConfig: {
        availableVoices: ['nova', 'alloy', 'echo', 'fable', 'onyx', 'shimmer'], // Ajoutez toutes les voix disponibles
        enabledVoices: {
            nova: true,
            alloy: true,
            echo: false,
            fable: false,
            onyx: false,
            shimmer: false,
        },
        defaultVoice: 'alloy',
        defaultSpeed: 1,
        defaultVolume: 1,
        enableSpeedControl: true,
        enableVolumeControl: true,
        delay: 0,
        enableSpeed: true,
    },
    enableQuickReplies: false,
    quickReplies: ["Salut ! En quoi peux-tu m'aider ?"],
    width: null,
    height: null,
    brandName: 'Aliatech',
    secondaryColor: '#1E40AF',
    buttonIcon: null,
    placeholderText: "Tapez votre message...",
    offlineText: "L'assistant est hors ligne",
    loadingIcon: null,
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
    darkModeIcon: null,
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
    enableFeedback: false,
    feedbackProbability: 0.3,
    enableSuggestions: true,
    enableAccessibility: true,
    accessibilityConfig: {
        highContrast: false,
        largeText: false,
        screenReaderSupport: true
    },
    avatarUrl: '',
    enableStatistics: false,
    statisticsConfig: {
        trackConversationLength: true,
        trackResponseTime: true,
        trackUserSatisfaction: true,
        trackTopics: true,
        trackUsagePatterns: true,
        reportingInterval: 'daily',
        kpiThresholds: {
            averageResponseTime: 5000,
            userSatisfactionTarget: 4.5,
            resolutionRateTarget: 0.8,
            resolvedMessage: "Ravi d'avoir pu vous aider ! N'hésitez pas si vous avez d'autres questions.",
            engagementRateTarget: 0.6,
        },
    },
    ttsToggleIcon: null,
    ttsIcon: null,
    serverUrl: 'https://assistant.aliatech.fr',
    apiEndpoints: {
        chat: '/api/chatbot/chat',
        status: '/api/chatbot/status',
        tts: '/api/chatbot/tts'
    },
    requestConfig: {
        timeout: 30000,
        maxRequestsPerMinute: 60,
        minRequestInterval: 1000,
        initialBackoffTime: 1000,
    },
    mobileBreakpoint: '768px',
    messageConfig: {
        enableTimestamp: true,
        enableReadStatus: true,
    },
    uiConfig: {
        chatWindowClass: 'fixed bottom-20 right-4 w-96',
        mobileFullScreen: true,
        showCloseButton: true,
        showDarkModeToggle: true,
    },
    showStatus: true,
    statusText: "Statut de l'assistant",
};

export default function CustomizeChatbot() {
    const [chatbotConfig, setChatbotConfig] = usePersistedState<ChatbotConfig>('chatbotConfig', defaultConfig);
    const [hasVisitedRecap, setHasVisitedRecap] = usePersistedState<boolean>('hasVisitedRecap', false);
    const router = useRouter();

    const tabOrder = ['features', 'messages', 'appearance'] as const;
    type Tab = typeof tabOrder[number];

    const [activeTab, setActiveTab] = usePersistedState<Tab>('activeTab', 'features');

    const handleConfigChange = (newConfig: ChatbotConfig) => {
        setChatbotConfig(newConfig);
        localStorage.setItem('chatbotConfig', JSON.stringify(newConfig));
    };

    const handleNextStep = () => {
        const currentIndex = tabOrder.indexOf(activeTab);
        if (currentIndex < tabOrder.length - 1) {
            setActiveTab(tabOrder[currentIndex + 1]);
        } else {
            localStorage.setItem('chatbotConfig', JSON.stringify(chatbotConfig));
            setHasVisitedRecap(true);
            router.push('/company-info');
        }
    };

    const resetAllConfig = () => {
        setChatbotConfig(defaultConfig);
        setActiveTab('features');
    };

    useEffect(() => {
        const storedHasVisitedRecap = localStorage.getItem('hasVisitedRecap');
        if (storedHasVisitedRecap) {
            setHasVisitedRecap(JSON.parse(storedHasVisitedRecap));
        }
    }, []);

    const isLastTab = activeTab === tabOrder[tabOrder.length - 1];
    const buttonText = isLastTab ? 'Terminé' : 'Suivant';

    return (
        <Layout title="Personnaliser votre chatbot">
            <ClientOnly>
                <div className="container mx-auto px-4 pb-12">
                    <motion.h1
                        className="text-4xl font-bold mb-8 text-center"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Personnalisez votre assistant IA
                    </motion.h1>
                    <div className="flex flex-col lg:flex-row gap-8">
                        <motion.div
                            className="w-full lg:w-2/3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <ChatbotCustomization
                                config={chatbotConfig}
                                onConfigChange={handleConfigChange}
                                activeTab={activeTab}
                                setActiveTab={(tab: Tab) => setActiveTab(tab)}
                            />
                            <div className="mt-8 flex justify-between items-center">
                                {hasVisitedRecap && (
                                    <div className="mt-4 flex justify-center">
                                        <Link href="/recap-and-test" passHref>
                                            <motion.button
                                                className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors flex items-center text-center pulse-animation"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Icons.Check />
                                                Retour au récapitulatif
                                            </motion.button>
                                        </Link>
                                    </div>
                                )}
                                <div className="flex justify-center mt-4">
                                    <motion.button
                                        onClick={handleNextStep}
                                        className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark flex items-center justify-center pulse-animation"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {buttonText}
                                        <ArrowRight className="ml-2" size={20} />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            className="w-full lg:w-1/3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h2 className="text-2xl font-bold mb-4 text-center">Aperçu en temps réel</h2>
                            <div className="sticky top-24">
                                <ChatbotPreview config={chatbotConfig} maxMessages={20} />
                            </div>
                            <div className="mt-4 flex justify-center">
                                <motion.button
                                    onClick={resetAllConfig}
                                    className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 flex items-center justify-center"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <RotateCcw className="mr-2" size={20} />
                                    TOUT RÉINITIALISER
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </ClientOnly>
        </Layout>
    );
}