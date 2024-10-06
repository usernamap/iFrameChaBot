import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import useChat from './hooks/useChat';
import useChatScroll from './hooks/useChatScroll';
import useMediaQuery from './hooks/useMediaQuery';
import { Icons } from './components/Icons';
import { getChatbotConfig } from './chatbotConfig';
import ReactMarkdown from 'react-markdown';
import './index.css';

const Chatbot = () => {
    const config = useMemo(() => getChatbotConfig(), []);
    const isMobile = useMediaQuery(`(max-width: ${config.mobileBreakpoint})`);
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [assistantStatus, setAssistantStatus] = useState('online');
    const [lastActivityTime, setLastActivityTime] = useState(Date.now());
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackRating, setFeedbackRating] = useState(null);
    const inputRef = useRef(null);
    const { messages, addMessage, isLoading, error, setError, retryLastMessage, markMessageAsRead } = useChat();
    const messagesEndRef = useChatScroll(messages);
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isFirstOpen, setIsFirstOpen] = useState(true);
    const [isServerAvailable, setIsServerAvailable] = useState(true);

    // TTS related state
    const [isTTSEnabled, setIsTTSEnabled] = useState(config.enableTTS);
    const [selectedVoice, setSelectedVoice] = useState(config.ttsConfig.defaultVoice);
    const [volume, setVolume] = useState(config.ttsConfig.defaultVolume);
    const [speed, setSpeed] = useState(config.ttsConfig.defaultSpeed);
    const [showTTSOptions, setShowTTSOptions] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playingMessageId, setPlayingMessageId] = useState(null);
    const [readMessageIds, setReadMessageIds] = useState(new Set());

    // TTS related refs
    const audioRef = useRef(new Audio());
    const ttsOptionsRef = useRef(null);

    // Rate limiting and request queue
    const requestQueueRef = useRef([]);
    const isProcessingRef = useRef(false);
    const lastRequestTimeRef = useRef(0);
    const backoffTimeRef = useRef(config.requestConfig.initialBackoffTime);

    // Statistics related state
    const [conversationStartTime, setConversationStartTime] = useState(null);
    const [responseTimes, setResponseTimes] = useState([]);
    const [userSatisfactionRatings, setUserSatisfactionRatings] = useState([]);
    const [topicsDiscussed, setTopicsDiscussed] = useState({});
    const [engagementRate, setEngagementRate] = useState(0);
    const [resolutionRate, setResolutionRate] = useState(0);
    const [isResolved, setIsResolved] = useState(false);
    const [detailedFeedback, setDetailedFeedback] = useState('');
    const [showProactivePrompt, setShowProactivePrompt] = useState(false);
    const [selectedRating, setSelectedRating] = useState(null);

    // Accessibility
    useEffect(() => {
        if (config.enableAccessibility) {
            if (config.accessibilityConfig.highContrast) {
                document.body.classList.add('high-contrast');
            }
            if (config.accessibilityConfig.largeText) {
                document.body.classList.add('large-text');
            }
            if (config.accessibilityConfig.screenReaderSupport) {
                document.body.setAttribute('aria-live', 'polite');
            }
        }
    }, [config.enableAccessibility, config.accessibilityConfig]);

    // Analytics and Statistics
    const updateStatistics = useCallback((newMessage, responseTime) => {
        if (!config.enableStatistics) return;

        if (config.statisticsConfig.trackConversationLength && !conversationStartTime) {
            setConversationStartTime(Date.now());
        }

        if (config.statisticsConfig.trackResponseTime && newMessage.isBot) {
            setResponseTimes(prev => [...prev, responseTime]);
        }

        if (config.statisticsConfig.trackTopics) {
            const words = newMessage.text.toLowerCase().split(' ');
            setTopicsDiscussed(prev => {
                const newTopics = { ...prev };
                words.forEach(word => {
                    if (word.length > 3) {
                        newTopics[word] = (newTopics[word] || 0) + 1;
                    }
                });
                return newTopics;
            });
        }

        if (config.statisticsConfig.trackUsagePatterns) {
            setEngagementRate(prev => {
                const totalInteractions = messages.length + 1;
                const userInteractions = messages.filter(m => !m.isBot).length + (newMessage.isBot ? 0 : 1);
                return userInteractions / totalInteractions;
            });
        }
    }, [config.enableStatistics, config.statisticsConfig, conversationStartTime, messages]);

    const generateReport = useCallback(() => {
        if (!config.enableStatistics) return null;

        const averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
        const averageSatisfaction = userSatisfactionRatings.reduce((a, b) => a + b, 0) / userSatisfactionRatings.length;

        const report = {
            conversationLength: conversationStartTime ? (Date.now() - conversationStartTime) / 1000 : 0,
            averageResponseTime,
            userSatisfaction: averageSatisfaction,
            topTopics: Object.entries(topicsDiscussed).sort((a, b) => b[1] - a[1]).slice(0, 5),
            engagementRate,
            resolutionRate,
        };

        console.log('Rapport de statistiques:', report);
        return report;
    }, [config.enableStatistics, responseTimes, userSatisfactionRatings, conversationStartTime, topicsDiscussed, engagementRate, resolutionRate]);

    useEffect(() => {
        if (config.enableStatistics && config.statisticsConfig.reportingInterval === 'daily') {
            const interval = setInterval(generateReport, 60 * 1000); // Chaque minute pour les tests (à changer en production)
            return () => clearInterval(interval);
        }
    }, [config.enableStatistics, config.statisticsConfig.reportingInterval, generateReport]);

    // Request Queue Management
    const processQueue = useCallback(async () => {
        if (isProcessingRef.current || requestQueueRef.current.length === 0) {
            return;
        }

        isProcessingRef.current = true;
        const now = Date.now();
        const timeElapsed = now - lastRequestTimeRef.current;

        if (timeElapsed < config.requestConfig.minRequestInterval) {
            await new Promise(resolve => setTimeout(resolve, config.requestConfig.minRequestInterval - timeElapsed));
        }

        const request = requestQueueRef.current.shift();
        try {
            const response = await request.execute();
            request.resolve(response);
            backoffTimeRef.current = config.requestConfig.initialBackoffTime;
        } catch (error) {
            if (error.response && error.response.status === 429) {
                await new Promise(resolve => setTimeout(resolve, backoffTimeRef.current));
                backoffTimeRef.current *= 2;
                requestQueueRef.current.unshift(request);
            } else {
                request.reject(error);
            }
        } finally {
            lastRequestTimeRef.current = Date.now();
            isProcessingRef.current = false;
            processQueue();
        }
    }, [config.requestConfig.minRequestInterval, config.requestConfig.initialBackoffTime]);

    const enqueueRequest = useCallback((execute) => {
        return new Promise((resolve, reject) => {
            requestQueueRef.current.push({ execute, resolve, reject });
            processQueue();
        });
    }, [processQueue]);

    const makeRequest = useCallback(async (endpoint, options) => {
        const url = `${config.serverUrl}${config.apiEndpoints[endpoint]}`;
        return enqueueRequest(() => axios(url, {
            ...options,
            timeout: config.requestConfig.timeout,
        }));
    }, [config.serverUrl, config.apiEndpoints, config.requestConfig.timeout, enqueueRequest]);

    // UI Interaction Handlers
    const handleOverlayClick = useCallback(() => {
        setIsOpen(false);
    }, []);

    const handleInputChange = useCallback((e) => {
        setInput(e.target.value);
        updateLastActivityTime();
    }, []);

    const toggleChat = useCallback(() => {
        setIsOpen((prevIsOpen) => {
            if (!prevIsOpen) {
                setIsButtonClicked(true);
                if (isFirstOpen && config.enableSuggestions) {
                    setShowSuggestions(true);
                    setIsFirstOpen(false);
                }
            } else {
                setIsButtonClicked(false);
            }
            return !prevIsOpen;
        });
        setError(null);
        updateLastActivityTime();
    }, [config.enableSuggestions, isFirstOpen]);

    const updateLastActivityTime = useCallback(() => {
        setLastActivityTime(Date.now());
        if (assistantStatus === 'away') {
            setAssistantStatus('online');
        }
    }, [assistantStatus]);

    // Server Status Check
    const checkServerStatus = useCallback(async () => {
        try {
            const response = await makeRequest('status', { timeout: 5000 });
            console.log("Response from server:", response);  // Log de la réponse complète
            if (response.data.status === 'online') {
                setAssistantStatus(prev => prev === 'offline' ? 'online' : prev);
                setIsServerAvailable(true);
            } else {
                setAssistantStatus('offline');
                setIsServerAvailable(false);
            }
        } catch (error) {
            console.error('Erreur lors de la vérification du statut du serveur:', error);
            setAssistantStatus('offline');
            setIsServerAvailable(false);
        }
    }, [makeRequest]);


    // Typing Simulation
    const simulateTyping = useCallback((duration) => {
        setIsTyping(true);
        return new Promise(resolve => {
            setTimeout(() => {
                setIsTyping(false);
                resolve();
            }, duration);
        });
    }, []);

    // TTS Handlers
    const handleVolumeChange = useCallback((e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    }, []);

    const toggleTTSOptions = useCallback(() => {
        setShowTTSOptions(prev => !prev);
    }, []);

    const getVolumeIcon = useCallback(() => {
        if (volume === 0) return <Icons.VolumeX />;
        if (volume < 0.5) return <Icons.Volume1 />;
        return <Icons.Volume2 />;
    }, [volume]);

    const handleClickOutside = useCallback((event) => {
        if (ttsOptionsRef.current && !ttsOptionsRef.current.contains(event.target)) {
            setShowTTSOptions(false);
        }
    }, []);

    const handleSpeedChange = useCallback((e) => {
        const newSpeed = parseFloat(e.target.value);
        setSpeed(newSpeed);
        if (audioRef.current) {
            audioRef.current.playbackRate = newSpeed;
        }
    }, []);

    const playTTS = useCallback(async (text, messageId) => {
        if (!isTTSEnabled || volume === 0) return;

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        setIsPlaying(true);
        setPlayingMessageId(messageId);

        try {
            const response = await makeRequest('tts', {
                method: 'POST',
                data: { text, voice: selectedVoice, speed },
                responseType: 'arraybuffer'
            });

            const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
            const audioUrl = URL.createObjectURL(audioBlob);
            audioRef.current.src = audioUrl;
            audioRef.current.volume = volume;
            audioRef.current.playbackRate = speed;
            await audioRef.current.play();
            audioRef.current.onended = () => {
                URL.revokeObjectURL(audioUrl);
                setReadMessageIds(prev => new Set(prev).add(messageId));
                setIsPlaying(false);
                setPlayingMessageId(null);
            };
        } catch (error) {
            console.error('Erreur lors de la lecture TTS:', error);
            setIsPlaying(false);
            setPlayingMessageId(null);
        }
    }, [isTTSEnabled, selectedVoice, volume, speed, makeRequest]);

    const replayMessage = useCallback((messageId, text) => {
        if (playingMessageId === messageId) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
            setPlayingMessageId(null);
        } else {
            playTTS(text, messageId);
        }
    }, [playingMessageId, playTTS]);

    // Message Submission Handler
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (input.trim() === '' || assistantStatus === 'offline') return;

        updateLastActivityTime();
        setShowSuggestions(false);

        const userMessage = {
            id: uuidv4(),
            text: input,
            isBot: false,
            timestamp: new Date(),
        };

        addMessage(userMessage);
        setInput('');

        const startTime = Date.now();

        try {
            const typingDuration = Math.random() * 2000 + 1000;
            const typingPromise = simulateTyping(typingDuration);

            const responsePromise = makeRequest('chat', {
                method: 'POST',
                data: { message: input },
                headers: { 'Content-Type': 'application/json' },
            });

            const [response] = await Promise.all([responsePromise, typingPromise]);

            const botMessage = {
                id: uuidv4(),
                text: response.data.message,
                isBot: true,
                timestamp: new Date(),
            };

            addMessage(botMessage);
            if (config.messageConfig.enableReadStatus) {
                setTimeout(() => markMessageAsRead(botMessage.id), 1000);
            }

            const endTime = Date.now();
            const responseTime = endTime - startTime;

            updateStatistics(botMessage, responseTime);

            if (config.enableFeedback && Math.random() < config.feedbackProbability) {
                setShowFeedback(true);
            }

            if (isTTSEnabled) {
                setTimeout(() => {
                    playTTS(botMessage.text, botMessage.id);
                }, config.ttsConfig.delay || 0);
            }

        } catch (error) {
            console.error('Erreur lors de la communication avec le chatbot:', error);
            handleApiError(error);
        }
    }, [input, addMessage, setError, simulateTyping, markMessageAsRead, assistantStatus, updateLastActivityTime, config.feedbackProbability, config.enableFeedback, playTTS, isTTSEnabled, makeRequest, config.messageConfig.enableReadStatus, config.ttsConfig.delay, updateStatistics]);

    const handleApiError = useCallback((error) => {
        if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNABORTED') {
                setError({ type: 'timeout', message: config.ERROR_MESSAGES.timeout });
            } else if (!error.response) {
                setError({ type: 'network', message: config.ERROR_MESSAGES.network });
            } else if (error.response.status === 429) {
                setError({ type: 'rateLimit', message: config.ERROR_MESSAGES.rateLimit });
            } else if (error.response.status >= 500) {
                setError({ type: 'server', message: config.ERROR_MESSAGES.server });
            } else {
                setError({ type: 'unknown', message: config.ERROR_MESSAGES.unknown });
            }
        } else {
            setError({ type: 'unknown', message: config.ERROR_MESSAGES.unknown });
        }
    }, [config.ERROR_MESSAGES, setError]);

    const handleDetailedFeedback = useCallback(() => {
        if (selectedRating === null) return;

        if (config.enableStatistics && config.statisticsConfig.trackUserSatisfaction) {
            setUserSatisfactionRatings(prev => [...prev, selectedRating]);
        }
        setShowFeedback(false);

        // Mise à jour du taux de résolution
        setResolutionRate(prev => {
            const totalFeedbacks = userSatisfactionRatings.length + 1;
            const resolvedIssues = userSatisfactionRatings.filter(r => r >= 4).length + (selectedRating >= 4 ? 1 : 0);
            return resolvedIssues / totalFeedbacks;
        });

        console.log(`Feedback détaillé : Note ${selectedRating}, Commentaire : ${detailedFeedback}`);
        setSelectedRating(null);
        setDetailedFeedback('');
    }, [config.enableStatistics, config.statisticsConfig.trackUserSatisfaction, userSatisfactionRatings, selectedRating, detailedFeedback]);

    const handleResolutionStatus = useCallback((resolved) => {
        setIsResolved(resolved);
        // Mise à jour du taux de résolution basée sur la confirmation de l'utilisateur
        setResolutionRate(prev => {
            const totalIssues = messages.filter(m => m.isBot).length;
            const resolvedIssues = (prev * (totalIssues - 1) + (resolved ? 1 : 0)) / totalIssues;
            return resolvedIssues;
        });
    }, [messages]);

    const handleQuickReply = useCallback((reply) => {
        setInput(reply);
        handleSubmit({ preventDefault: () => { } });
    }, [handleSubmit]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        const checkActivityStatus = () => {
            if (Date.now() - lastActivityTime > 3 * 60 * 1000) {
                setAssistantStatus('away');
            }
        };

        const activityInterval = setInterval(checkActivityStatus, 60000);
        const serverCheckInterval = setInterval(checkServerStatus, 60000);

        return () => {
            clearInterval(activityInterval);
            clearInterval(serverCheckInterval);
        };
    }, [lastActivityTime, checkServerStatus]);

    useEffect(() => {
        checkServerStatus();
    }, [checkServerStatus]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    useEffect(() => {
        // Logique pour afficher un prompt proactif après un certain temps d'inactivité
        if (messages.length > 0 && Date.now() - lastActivityTime > 60000) {
            setShowProactivePrompt(true);
        }
    }, [messages, lastActivityTime]);

    const toggleDarkMode = useCallback(() => {
        setIsDarkMode((prevMode) => !prevMode);
    }, []);

    const getThemeStyles = useCallback(() => {
        if (isDarkMode && config.enableDarkMode) {
            return {
                backgroundColor: config.darkModeConfig.backgroundColor,
                color: config.darkModeConfig.textColor,
            };
        }
        return {};
    }, [isDarkMode, config.enableDarkMode, config.darkModeConfig]);

    useEffect(() => {
        if (config.enableDarkMode === false) {
            setIsDarkMode(false);
        }
    }, [config.enableDarkMode]);

    useEffect(() => {
        if (isOpen && messages.length === 0 && config.welcomeMessage) {
            const welcomeMessage = {
                id: uuidv4(),
                text: config.welcomeMessage,
                isBot: true,
                timestamp: new Date(),
            };
            addMessage(welcomeMessage);
        }
    }, [isOpen, messages.length, addMessage, config.welcomeMessage]);

    const renderErrorMessage = useCallback(() => {
        if (!error) return null;

        const IconComponent = Icons[error.type === 'network' ? 'Wifi' :
            error.type === 'timeout' ? 'Clock' : 'AlertTriangle'];

        return (
            <div className="text-center text-red-500 my-2" role="alert">
                <IconComponent aria-hidden="true" />
                <span className="ml-2">{error.message}</span>
            </div>
        );
    }, [error]);

    const renderTypingAnimation = useCallback(() => {
        if (!config.enableTypingAnimation) {
            return <div className="text-gray-500 text-sm mt-2" aria-live="polite">{config.typingText}</div>;
        }
        return (
            <div className="flex items-center space-x-1 mt-2" aria-live="polite" aria-label="L'assistant est en train d'écrire">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
        );
    }, [config.enableTypingAnimation, config.typingText]);

    const renderMessage = useCallback((message) => {
        if (message.isBot) {
            return (
                <ReactMarkdown
                    components={{
                        h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-2" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-2" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-md font-bold mb-1" {...props} />,
                        p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2" {...props} />,
                        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                        a: ({ node, ...props }) => <a className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                        em: ({ node, ...props }) => <em className="italic" {...props} />,
                        code: ({ node, inline, ...props }) =>
                            inline
                                ? <code className="bg-gray-200 rounded px-1" {...props} />
                                : <code className="block bg-gray-200 rounded p-2 mb-2 overflow-x-auto" {...props} />,
                    }}
                >
                    {message.text}
                </ReactMarkdown>
            );
        }
        return message.text;
    }, []);

    const renderTTSIcon = useCallback((messageId) => {
        if (playingMessageId === messageId) {
            return <Icons.Volume2 aria-label="En cours de lecture" />;
        } else if (readMessageIds.has(messageId)) {
            return <Icons.Volume0 aria-label="Déjà lu" />;
        } else {
            return <Icons.VolumeUp aria-label="Lire le message" />;
        }
    }, [playingMessageId, readMessageIds]);

    if (!isServerAvailable) {
        return (
            <iframe
                style={{
                    width: '0',
                    height: '0',
                    border: 'none',
                    position: 'fixed',
                    pointerEvents: 'none',
                }}
                title="Chatbot iframe (server unavailable)"
            />
        );
    }

    return (
        <>
            <div className="chatbot-wrapper" role="region" aria-label="Chatbot"></div>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-transparent z-30"
                    onClick={handleOverlayClick}
                    aria-hidden="true"
                />
            )}
            <div className="relative z-40">
                {(!isOpen || !isMobile) && (
                    <div className="fixed bottom-4 right-4">
                        <button
                            onClick={toggleChat}
                            className={`bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition flex items-center justify-center ${config.animateOpenClose && !isButtonClicked ? 'animate-bounce' : ''}`}
                            aria-label={isOpen ? "Fermer le chat" : "Ouvrir le chat"}
                            style={{
                                backgroundColor: isDarkMode ? config.darkModeConfig.primaryColor : config.primaryColor,
                                width: isMobile ? '48px' : config.width,
                                height: isMobile ? '48px' : config.height
                            }}
                        >
                            {config.buttonIcon || <Icons.MessageCircle aria-hidden="true" />}
                        </button>
                    </div>
                )}

                {isOpen && (
                    <div
                        className={`fixed ${isMobile && config.uiConfig.mobileFullScreen ? 'inset-0' : config.uiConfig.chatWindowClass} bg-white rounded-lg shadow-xl overflow-hidden flex flex-col transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                        style={{
                            fontFamily: config.fontFamily,
                            ...getThemeStyles(),
                            width: isMobile ? '100%' : config.width,
                            height: isMobile ? '100%' : config.height
                        }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="chat-header"
                    >
                        {/* Header */}
                        <header
                            className={`bg-blue-600 text-white p-4 flex items-center justify-between`}
                            style={{ backgroundColor: isDarkMode ? config.darkModeConfig.primaryColor : config.primaryColor }}
                            id="chat-header"
                        >
                            <div className="flex items-center">
                                {isMobile && config.uiConfig.showCloseButton && (
                                    <button
                                        onClick={toggleChat}
                                        className="text-white hover:text-gray-200 transition p-2 mr-2"
                                        aria-label="Fermer le chat"
                                    >
                                        <Icons.ChevronLeft aria-hidden="true" />
                                    </button>
                                )}
                                <div className={`flex flex-col ${isMobile ? 'text-center' : ''}`}>
                                    <h2 className="font-bold">{config.headerTitle}</h2>
                                    <p className="text-sm">{config.STATUS_MESSAGES[assistantStatus]}</p>
                                </div>
                                {config.enableDarkMode && config.uiConfig.showDarkModeToggle && (
                                    <button
                                        onClick={toggleDarkMode}
                                        className="text-white hover:text-gray-200 transition p-2 ml-4"
                                        aria-label={isDarkMode ? "Désactiver le mode sombre" : "Activer le mode sombre"}
                                    >
                                        {isDarkMode ? <Icons.Sun aria-hidden="true" /> : <Icons.Moon aria-hidden="true" />}
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center">
                                {config.enableTTS && (
                                    <div className="relative" ref={ttsOptionsRef}>
                                        <button
                                            onClick={toggleTTSOptions}
                                            className="text-white hover:text-gray-200 transition p-2"
                                            aria-label="Options de synthèse vocale"
                                            aria-expanded={showTTSOptions}
                                            aria-controls="tts-options"
                                        >
                                            {showTTSOptions ? getVolumeIcon() : (config.ttsToggleIcon || <Icons.TTS />)}
                                        </button>
                                        {showTTSOptions && (
                                            <div
                                                id="tts-options"
                                                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
                                                style={isDarkMode ? { backgroundColor: config.darkModeConfig.backgroundColor } : {}}
                                            >
                                                <div className="p-2">
                                                    <label className="block text-sm font-medium text-gray-700"
                                                        style={isDarkMode ? { color: config.darkModeConfig.textColor } : {}}
                                                    >
                                                        Volume
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="1"
                                                            step="0.01"
                                                            value={volume}
                                                            onChange={handleVolumeChange}
                                                            className="w-full mt-1"
                                                            aria-label="Volume de la synthèse vocale"
                                                        />
                                                    </label>
                                                    <label className="block mt-2 text-sm font-medium text-gray-700"
                                                        style={isDarkMode ? { color: config.darkModeConfig.textColor } : {}}
                                                    >
                                                        Vitesse
                                                        <input
                                                            type="range"
                                                            min="0.5"
                                                            max="2"
                                                            step="0.1"
                                                            value={speed}
                                                            onChange={handleSpeedChange}
                                                            className="w-full mt-1"
                                                            aria-label="Vitesse de la synthèse vocale"
                                                        />
                                                        <span className="text-xs">{speed.toFixed(1)}x</span>
                                                    </label>
                                                    <label className="block mt-2 text-sm font-medium text-gray-700"
                                                        style={isDarkMode ? { color: config.darkModeConfig.textColor } : {}}
                                                    >
                                                        Voix
                                                        <select
                                                            value={selectedVoice}
                                                            onChange={(e) => setSelectedVoice(e.target.value)}
                                                            className="w-full mt-1 block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                            style={isDarkMode ? {
                                                                backgroundColor: config.darkModeConfig.inputBackgroundColor,
                                                                color: config.darkModeConfig.inputTextColor
                                                            } : {}}
                                                            aria-label="Sélectionner une voix pour la synthèse vocale"
                                                        >
                                                            {config.ttsConfig.availableVoices.map((voice) => (
                                                                <option key={voice} value={voice}>{voice}</option>
                                                            ))}
                                                        </select>
                                                    </label>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className={`ml-2 w-3 h-3 rounded-full ${config.STATUS_COLORS[assistantStatus]}`} aria-hidden="true"></div>
                            </div>
                        </header>

                        {/* Chat Messages */}
                        <main
                            className={`${isMobile ? 'flex-grow' : 'h-96'} overflow-y-auto p-4 chat-container`}
                            ref={messagesEndRef}
                            aria-live="polite"
                            aria-relevant="additions"
                        >
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`mb-2 ${message.isBot ? 'text-left' : 'text-right'}`}
                                >
                                    {config.avatarUrl && message.isBot && (
                                        <img src={config.avatarUrl} alt="Avatar de l'assistant" className="w-8 h-8 rounded-full mr-2 inline-block" />
                                    )}
                                    <span
                                        className={`inline-block p-2 rounded-3xl ${message.isBot
                                            ? 'bg-gray-200 text-gray-800'
                                            : 'text-white'} ${message.isBot ? 'rounded-tl-none' : 'rounded-tr-none'}`}
                                        style={message.isBot
                                            ? (isDarkMode ? { backgroundColor: config.darkModeConfig.messageBackgroundColor, color: config.darkModeConfig.messageTextColor } : {})
                                            : { backgroundColor: isDarkMode ? config.darkModeConfig.userMessageBackgroundColor : config.primaryColor, color: isDarkMode ? config.darkModeConfig.userMessageTextColor : 'white' }}
                                    >
                                        {renderMessage(message)}
                                    </span>
                                    <div className="text-xs text-gray-500 mt-1 flex items-center justify-end">
                                        {config.messageConfig.enableTimestamp && (
                                            <time dateTime={message.timestamp.toISOString()}>
                                                {message.timestamp.toLocaleTimeString()}
                                            </time>
                                        )}
                                        {!message.isBot && config.messageConfig.enableReadStatus && (
                                            <span className="ml-1" aria-label={message.isRead ? "Lu" : "Envoyé"}>
                                                {message.isRead ? <Icons.CheckCheck aria-hidden="true" /> : <Icons.Check aria-hidden="true" />}
                                            </span>
                                        )}
                                        {message.isBot && isTTSEnabled && (
                                            <button
                                                onClick={() => replayMessage(message.id, message.text)}
                                                className="ml-2 text-blue-500 hover:text-blue-700"
                                                aria-label={playingMessageId === message.id ? "Arrêter la lecture" : "Lire le message"}
                                            >
                                                {renderTTSIcon(message.id)}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isTyping && renderTypingAnimation()}
                            {renderErrorMessage()}
                        </main>

                        {/* Feedback */}
                        {config.enableFeedback && showFeedback && (
                            <div className="p-2 border-t border-gray-200" style={isDarkMode ? { backgroundColor: config.darkModeConfig.feedbackBackgroundColor, borderColor: config.darkModeConfig.primaryColor } : {}}>
                                <p className="text-sm text-center mb-2" style={isDarkMode ? { color: config.darkModeConfig.feedbackTextColor } : {}}>Comment évaluez-vous cette réponse ?</p>
                                <div className="flex justify-center space-x-2" role="group" aria-label="Évaluation de la réponse">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <button
                                            key={rating}
                                            onClick={() => setSelectedRating(rating)}
                                            className="p-1 hover:bg-gray-200 rounded"
                                            style={isDarkMode ? { color: config.darkModeConfig.primaryColor } : {}}
                                            aria-label={`Note de ${rating} étoiles`}
                                            aria-pressed={selectedRating === rating}
                                        >
                                            {rating <= selectedRating ? <Icons.StarFilled aria-hidden="true" /> : <Icons.Star aria-hidden="true" />}
                                        </button>
                                    ))}
                                </div>
                                <label htmlFor="detailed-feedback" className="sr-only">Commentaires supplémentaires</label>
                                <textarea
                                    id="detailed-feedback"
                                    value={detailedFeedback}
                                    onChange={(e) => setDetailedFeedback(e.target.value)}
                                    placeholder="Commentaires supplémentaires (optionnel)"
                                    className="w-full mt-2 p-2 border rounded"
                                    style={isDarkMode ? {
                                        backgroundColor: config.darkModeConfig.inputBackgroundColor,
                                        color: config.darkModeConfig.inputTextColor,
                                        borderColor: config.darkModeConfig.primaryColor
                                    } : {}}
                                />
                                <button
                                    onClick={handleDetailedFeedback}
                                    className="mt-2 w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    style={{
                                        backgroundColor: isDarkMode ? config.darkModeConfig.buttonBackgroundColor : config.primaryColor,
                                        opacity: selectedRating === null ? 0.5 : 1
                                    }}
                                    disabled={selectedRating === null}
                                >
                                    Envoyer l'avis
                                </button>
                            </div>
                        )}

                        {/* Resolution Status */}
                        {!isResolved && messages.length >= 5 && (
                            <div className="p-2 border-t border-gray-200" style={isDarkMode ? { backgroundColor: config.darkModeConfig.feedbackBackgroundColor, borderColor: config.darkModeConfig.primaryColor } : {}}>
                                <p className="text-sm text-center mb-2" style={isDarkMode ? { color: config.darkModeConfig.feedbackTextColor } : {}}>Votre problème a-t-il été résolu ?</p>
                                <div className="flex justify-center space-x-2">
                                    <button
                                        onClick={() => handleResolutionStatus(true)}
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                        style={isDarkMode ? { backgroundColor: config.darkModeConfig.buttonBackgroundColor } : {}}
                                    >
                                        Oui
                                    </button>
                                    <button
                                        onClick={() => handleResolutionStatus(false)}
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                        style={isDarkMode ? { backgroundColor: config.darkModeConfig.buttonBackgroundColor } : {}}
                                    >
                                        Non
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Proactive Prompt */}
                        {showProactivePrompt && (
                            <div className="p-2 border-t border-gray-200" style={isDarkMode ? { backgroundColor: config.darkModeConfig.feedbackBackgroundColor, borderColor: config.darkModeConfig.primaryColor } : {}}>
                                <p className="text-sm text-center mb-2" style={isDarkMode ? { color: config.darkModeConfig.feedbackTextColor } : {}}>Avez-vous besoin d'aide supplémentaire ?</p>
                                <div className="flex justify-center space-x-2">
                                    <button
                                        onClick={() => setShowProactivePrompt(false)}
                                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                        style={isDarkMode ? { backgroundColor: config.darkModeConfig.buttonBackgroundColor } : {}}
                                    >
                                        Non, merci
                                    </button>
                                    <button
                                        onClick={() => {
                                            setInput("J'ai besoin d'aide supplémentaire");
                                            handleSubmit({ preventDefault: () => { } });
                                            setShowProactivePrompt(false);
                                        }}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        style={isDarkMode ? { backgroundColor: config.darkModeConfig.buttonBackgroundColor } : {}}
                                    >
                                        Oui, s'il vous plaît
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Quick Replies */}
                        {config.enableSuggestions && showSuggestions && (
                            <div className="flex flex-wrap justify-center p-2 border-t" style={isDarkMode ? { borderColor: config.darkModeConfig.primaryColor } : {}}>
                                {config.quickReplies.map((reply, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleQuickReply(reply)}
                                        className="m-1 px-3 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition"
                                        style={isDarkMode ? {
                                            backgroundColor: config.darkModeConfig.suggestionBackgroundColor,
                                            color: config.darkModeConfig.suggestionTextColor
                                        } : {}}
                                    >
                                        {reply}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input Form */}
                        <form onSubmit={handleSubmit} className="p-4 border-t" style={isDarkMode ? { borderColor: config.darkModeConfig.primaryColor } : {}}>
                            <div className="flex">
                                <label htmlFor="chat-input" className="sr-only">Entrez votre message</label>
                                <input
                                    id="chat-input"
                                    type="text"
                                    value={input}
                                    onChange={handleInputChange}
                                    placeholder={assistantStatus === 'offline' ? config.offlineText : config.placeholderText}
                                    className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    disabled={isLoading || assistantStatus === 'offline'}
                                    ref={inputRef}
                                    style={isDarkMode ? {
                                        backgroundColor: config.darkModeConfig.inputBackgroundColor,
                                        color: config.darkModeConfig.inputTextColor,
                                        borderColor: config.darkModeConfig.primaryColor
                                    } : {}}
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700 transition disabled:opacity-50"
                                    disabled={isLoading || input.trim() === '' || assistantStatus === 'offline'}
                                    aria-label="Envoyer message"
                                    style={{
                                        backgroundColor: isDarkMode ? config.darkModeConfig.buttonBackgroundColor : config.primaryColor,
                                        color: isDarkMode ? config.darkModeConfig.buttonTextColor : 'white'
                                    }}
                                >
                                    {isLoading ? (config.loadingIcon || <Icons.Loader aria-hidden="true" />) : (config.sendButtonIcon || <Icons.Send aria-hidden="true" />)}
                                </button>
                            </div>
                            {error && (
                                <button
                                    onClick={retryLastMessage}
                                    className="mt-2 text-blue-600 hover:text-blue-800 flex items-center justify-center w-full"
                                    aria-label="Réessayer l'envoi du message"
                                    style={{ color: isDarkMode ? config.darkModeConfig.primaryColor : config.primaryColor }}
                                >
                                    <Icons.RefreshCw aria-hidden="true" /> <span className="ml-2">Réessayer</span>
                                </button>
                            )}
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}

export default Chatbot;