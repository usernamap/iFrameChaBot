import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import useChat from './hooks/useChat';
import useChatScroll from './hooks/useChatScroll';
import useMediaQuery from './hooks/useMediaQuery';
import { Icons } from './components/Icons';
import { getChatbotConfig } from './chatbotConfig';
import './index.css';

const Chatbot = () => {
    const config = getChatbotConfig();
    const isMobile = useMediaQuery('(max-width: 768px)');
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

    // Variables d'état pour TTS optimisées
    const [isTTSEnabled, setIsTTSEnabled] = useState(config.enableTTS);
    const [selectedVoice, setSelectedVoice] = useState(config.ttsConfig.defaultVoice.toLowerCase());
    const [volume, setVolume] = useState(1);
    const [showTTSOptions, setShowTTSOptions] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(new Audio());
    const ttsQueueRef = useRef([]);
    const ttsLockRef = useRef(false);
    const [readMessageIds, setReadMessageIds] = useState(new Set());
    const ttsOptionsRef = useRef(null);
    const [speed, setSpeed] = useState(1);
    const [playingMessageId, setPlayingMessageId] = useState(null);

    const handleOverlayClick = useCallback(() => {
        setIsOpen(false);
    }, []);

    const handleInputChange = (e) => {
        setInput(e.target.value);
        updateLastActivityTime();
    };

    const toggleChat = () => {
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
    };

    const updateLastActivityTime = useCallback(() => {
        setLastActivityTime(Date.now());
        if (assistantStatus === 'away') {
            setAssistantStatus('online');
        }
    }, [assistantStatus]);

    const checkServerStatus = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/status', { timeout: 5000 });
            if (response.data.status === 'online') {
                setAssistantStatus(prev => prev === 'offline' ? 'online' : prev);
            } else {
                setAssistantStatus('offline');
            }
        } catch (error) {
            console.error('Erreur lors de la vérification du statut du serveur:', error);
            setAssistantStatus('offline');
        }
    }, []);

    const simulateTyping = useCallback((duration) => {
        setIsTyping(true);
        return new Promise(resolve => {
            setTimeout(() => {
                setIsTyping(false);
                resolve();
            }, duration);
        });
    }, []);

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
        if (!isTTSEnabled || ttsLockRef.current || volume === 0) return;

        if (!readMessageIds.has(messageId) || playingMessageId === messageId) {
            ttsQueueRef.current.push({ text, messageId });

            const playNext = async () => {
                if (ttsQueueRef.current.length === 0) {
                    setIsPlaying(false);
                    ttsLockRef.current = false;
                    setPlayingMessageId(null);
                    return;
                }

                ttsLockRef.current = true;
                const { text: nextText, messageId: nextMessageId } = ttsQueueRef.current.shift();
                setIsPlaying(true);
                setPlayingMessageId(nextMessageId);

                try {
                    const response = await axios.post('http://localhost:3001/api/tts',
                        {
                            text: nextText,
                            voice: selectedVoice,
                            speed: 1
                        },
                        {
                            responseType: 'arraybuffer'
                        }
                    );
                    const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    audioRef.current.src = audioUrl;
                    audioRef.current.volume = volume;
                    audioRef.current.playbackRate = speed;
                    await audioRef.current.play();
                    audioRef.current.onended = () => {
                        URL.revokeObjectURL(audioUrl);
                        setReadMessageIds(prev => new Set(prev).add(nextMessageId));
                        playNext();
                    };
                } catch (error) {
                    console.error('Erreur lors de la lecture TTS:', error);
                    ttsLockRef.current = false;
                    setPlayingMessageId(null);
                    playNext();
                }
            };

            if (!isPlaying) {
                playNext();
            }
        }
    }, [isTTSEnabled, selectedVoice, volume, speed, readMessageIds, playingMessageId]);

    const replayMessage = useCallback((messageId, text) => {
        setPlayingMessageId(messageId);
        playTTS(text, messageId);
    }, [playTTS]);

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

        try {
            const typingDuration = Math.random() * 2000 + 1000;
            const typingPromise = simulateTyping(typingDuration);

            const responsePromise = axios.post('http://localhost:3001/api/chat', { message: input }, {
                timeout: 30000,
                headers: { 'Content-Type': 'application/json' }
            });

            const [response] = await Promise.all([responsePromise, typingPromise]);

            if (response.status !== 200) {
                throw new Error('Non-200 response status');
            }

            const botMessage = {
                id: uuidv4(),
                text: response.data.message,
                isBot: true,
                timestamp: new Date(),
            };

            addMessage(botMessage);
            setTimeout(() => markMessageAsRead(botMessage.id), 1000);

            if (config.enableFeedback && Math.random() < config.feedbackProbability) {
                setShowFeedback(true);
            }

            if (isTTSEnabled) {
                playTTS(botMessage.text, botMessage.id);
            }

        } catch (error) {
            console.error('Erreur lors de la communication avec le chatbot:', error);
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
        }
    }, [input, addMessage, setError, simulateTyping, markMessageAsRead, assistantStatus, updateLastActivityTime, config.ERROR_MESSAGES, config.feedbackProbability, config.enableFeedback, playTTS, isTTSEnabled]);

    const handleFeedback = useCallback((rating) => {
        setFeedbackRating(rating);
        console.log(`Feedback donné : ${rating}`);
        setShowFeedback(false);
    }, []);

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
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.isBot && isTTSEnabled && !readMessageIds.has(lastMessage.id)) {
                playTTS(lastMessage.text, lastMessage.id);
            }
        }
    }, [messages, playTTS, isTTSEnabled, readMessageIds]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    const toggleDarkMode = useCallback(() => {
        setIsDarkMode((prevMode) => !prevMode);
    }, []);

    const getThemeStyles = useCallback(() => {
        if (isDarkMode && config.enableDarkMode && config.darkModeConfig) {
            return {
                backgroundColor: config.darkModeConfig.backgroundColor || '#333',
                color: config.darkModeConfig.textColor || '#fff',
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

    const renderErrorMessage = () => {
        if (!error) return null;

        const IconComponent = Icons[error.type === 'network' ? 'Wifi' :
            error.type === 'timeout' ? 'Clock' : 'AlertTriangle'];

        return (
            <div className="text-center text-red-500 my-2">
                <IconComponent />
                <span className="ml-2">{error.message}</span>
            </div>
        );
    };

    const renderTypingAnimation = () => {
        if (!config.enableTypingAnimation) {
            return <div className="text-gray-500 text-sm mt-2">{config.typingText}</div>;
        }
        return (
            <div className="chatbot-container flex items-center space-x-1 mt-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
        );
    };

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-transparent z-30"
                    onClick={handleOverlayClick}
                />
            )}
            <div className="relative z-40">
                {(!isOpen || !isMobile) && (
                    <div className="fixed bottom-4 right-4">
                        <button
                            onClick={toggleChat}
                            className={`bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition flex items-center justify-center ${config.animateOpenClose && !isButtonClicked ? 'animate-bounce' : ''}`}
                            aria-label="Ouverture Assistant"
                            style={{ backgroundColor: config.primaryColor }}
                        >
                            {config.buttonIcon || <Icons.MessageCircle />}
                        </button>
                    </div>
                )}

                {isOpen && (
                    <div
                        className={`fixed ${isMobile ? 'inset-0' : 'bottom-20 right-4 w-96'} bg-white rounded-lg shadow-xl overflow-hidden flex flex-col transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                        style={{
                            fontFamily: config.fontFamily,
                            ...getThemeStyles()
                        }}
                    >
                        <div className={`bg-blue-600 text-white p-4 flex items-center justify-between`}
                            style={{ backgroundColor: isDarkMode ? config.darkModeConfig.primaryColor : config.primaryColor }}>
                            <div className="flex items-center">
                                {isMobile && (
                                    <button
                                        onClick={toggleChat}
                                        className="text-white hover:text-gray-200 transition p-2 mr-2"
                                        aria-label="Fermer le chat"
                                    >
                                        <Icons.ChevronLeft />
                                    </button>
                                )}
                                <div className={`flex flex-col ${isMobile ? 'text-center' : ''}`}>
                                    <h3 className="font-bold">{config.headerTitle}</h3>
                                    <p className="text-sm">{config.STATUS_MESSAGES[assistantStatus]}</p>
                                </div>
                                {config.enableDarkMode && (
                                    <button
                                        onClick={toggleDarkMode}
                                        className="text-white hover:text-gray-200 transition p-2 ml-4"
                                        aria-label="Basculer le mode sombre"
                                    >
                                        {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center">
                                {config.enableTTS && (
                                    <div className="relative" ref={ttsOptionsRef}>
                                        <button
                                            onClick={toggleTTSOptions}
                                            className="text-white hover:text-gray-200 transition p-2"
                                            aria-label="Options TTS"
                                        >
                                            {showTTSOptions ? getVolumeIcon() : <Icons.TTS />}
                                        </button>
                                        {showTTSOptions && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                                                <div className="p-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Volume
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="1"
                                                            step="0.01"
                                                            value={volume}
                                                            onChange={handleVolumeChange}
                                                            className="w-full mt-1"
                                                        />
                                                    </label>
                                                    <label className="block mt-2 text-sm font-medium text-gray-700">
                                                        Vitesse
                                                        <input
                                                            type="range"
                                                            min="0.5"
                                                            max="2"
                                                            step="0.1"
                                                            value={speed}
                                                            onChange={handleSpeedChange}
                                                            className="w-full mt-1"
                                                        />
                                                        <span className="text-xs">{speed.toFixed(1)}x</span>
                                                    </label>
                                                    <label className="block mt-2 text-sm font-medium text-gray-700">
                                                        Voix
                                                        <select
                                                            value={selectedVoice}
                                                            onChange={(e) => setSelectedVoice(e.target.value)}
                                                            className="w-full mt-1 block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                                <div className={`ml-2 w-3 h-3 rounded-full ${config.STATUS_COLORS[assistantStatus]}`}></div>
                            </div>
                        </div>
                        <div className={`${isMobile ? 'flex-grow' : 'h-96'} overflow-y-auto p-4 chat-container`} ref={messagesEndRef}>
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`mb-2 ${message.isBot ? 'text-left' : 'text-right'}`}
                                >
                                    <span
                                        className={`inline-block p-2 rounded-3xl ${message.isBot
                                            ? 'bg-gray-200 text-gray-800'
                                            : 'text-white'} ${message.isBot ? 'rounded-tl-none' : 'rounded-tr-none'}`}
                                        style={!message.isBot ? { backgroundColor: isDarkMode ? config.darkModeConfig.primaryColor : config.primaryColor } : {}}
                                    >
                                        {message.text}
                                    </span>
                                    <div className="text-xs text-gray-500 mt-1 flex items-center justify-end">
                                        {message.timestamp.toLocaleTimeString()}
                                        {!message.isBot && (
                                            <span className="ml-1">
                                                {message.isRead ? <Icons.CheckCheck /> : <Icons.Check />}
                                            </span>
                                        )}
                                        {message.isBot && isTTSEnabled && (
                                            <button
                                                onClick={() => replayMessage(message.id, message.text)}
                                                className="ml-2 text-blue-500 hover:text-blue-700"
                                                aria-label={playingMessageId === message.id ? "Lecture en cours" : "Lire le message"}
                                            >
                                                {playingMessageId === message.id ? <Icons.Volume2 /> :
                                                    readMessageIds.has(message.id) ? <Icons.RefreshCw /> : <Icons.VolumeUp />}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isTyping && renderTypingAnimation()}
                            {renderErrorMessage()}
                        </div>
                        {config.enableFeedback && showFeedback && (
                            <div className="p-2 bg-gray-100 border-t border-gray-200">
                                <p className="text-sm text-center mb-2">Comment évaluez-vous cette réponse ?</p>
                                <div className="flex justify-center space-x-2">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <button
                                            key={rating}
                                            onClick={() => handleFeedback(rating)}
                                            className="p-1 hover:bg-gray-200 rounded"
                                        >
                                            {rating <= feedbackRating ? <Icons.Star /> : <Icons.StarOutline />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {config.enableSuggestions && showSuggestions && (
                            <div className="flex flex-wrap justify-center p-2 border-t">
                                {config.quickReplies.map((reply, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleQuickReply(reply)}
                                        className="m-1 px-3 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition"
                                    >
                                        {reply}
                                    </button>
                                ))}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="p-4 border-t">
                            <div className="flex">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={handleInputChange}
                                    placeholder={assistantStatus === 'offline' ? config.offlineText : config.placeholderText}
                                    className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    disabled={isLoading || assistantStatus === 'offline'}
                                    ref={inputRef}
                                    style={isDarkMode ? { backgroundColor: config.darkModeConfig.backgroundColor, color: config.darkModeConfig.textColor } : {}}
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700 transition disabled:opacity-50"
                                    disabled={isLoading || input.trim() === '' || assistantStatus === 'offline'}
                                    aria-label="Envoyer message"
                                    style={{ backgroundColor: isDarkMode ? config.darkModeConfig.primaryColor : config.primaryColor }}
                                >
                                    {isLoading ? config.loadingIcon || <Icons.Loader /> : config.sendButtonIcon || <Icons.Send />}
                                </button>
                            </div>
                            {error && (
                                <button
                                    onClick={retryLastMessage}
                                    className="mt-2 text-blue-600 hover:text-blue-800 flex items-center justify-center w-full"
                                    aria-label="Réessayer l'envoi du message"
                                    style={{ color: isDarkMode ? config.darkModeConfig.primaryColor : config.primaryColor }}
                                >
                                    <Icons.RefreshCw /> <span className="ml-2">Réessayer</span>
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