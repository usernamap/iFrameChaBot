import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { ChatbotConfig } from '../../types';
import { Icons } from '@/components/common/Icons';
import TypingAnimation from './TypingAnimation';
import ReactMarkdown from 'react-markdown';

interface ChatbotPreviewProps {
    config: ChatbotConfig;
}

const TTSOptionsPortal: React.FC<{
    children: React.ReactNode;
    isDarkMode: boolean;
    config: ChatbotConfig;
    parentRef: React.RefObject<HTMLButtonElement>;
}> = ({ children, isDarkMode, config, parentRef }) => {
    const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const portalRoot = document.getElementById('portal-root') || document.body;

    useEffect(() => {
        if (parentRef.current) {
            const rect = parentRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
            });
        }
    }, [parentRef]);

    return ReactDOM.createPortal(
        <div
            className="tts-options-portal"
            style={{
                position: 'absolute',
                top: position.top,
                left: position.left,
                zIndex: 1000,
            }}
        >
            <div
                className="bg-white rounded-md shadow-lg"
                style={{
                    ...isDarkMode
                        ? { backgroundColor: config.darkModeConfig.backgroundColor }
                        : {},
                }}
            >
                {children}
            </div>
        </div>,
        portalRoot
    );
};

const ChatbotPreview: React.FC<ChatbotPreviewProps> = ({ config }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            text: config.welcomeMessage,
            isBot: true,
            timestamp: new Date().toISOString(), // Utilisez toISOString() pour une représentation cohérente
            isRead: false
        },
    ]);
    const [clientSideMessages, setClientSideMessages] = useState<Array<{
        id: string;
        text: string;
        isBot: boolean;
        timestamp: string;
        isRead: boolean;
    }>>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState<{ type: string; message: string } | null>(null);
    const [assistantStatus, setAssistantStatus] = useState('online');
    const [lastActivityTime, setLastActivityTime] = useState(Date.now());
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackRating, setFeedbackRating] = useState<number | null>(null);
    const [detailedFeedback, setDetailedFeedback] = useState('');
    const [isResolved, setIsResolved] = useState(false);
    const [showProactivePrompt, setShowProactivePrompt] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    // TTS related state
    const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
    const [isTTSEnabled, setIsTTSEnabled] = useState(config.enableTTS);
    const [selectedVoice, setSelectedVoice] = useState(config.ttsConfig.defaultVoice);
    const [volume, setVolume] = useState(config.ttsConfig.defaultVolume);
    const [speed, setSpeed] = useState(config.ttsConfig.defaultSpeed);
    const [showTTSOptions, setShowTTSOptions] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
    const [readMessageIds, setReadMessageIds] = useState(new Set<string>());
    const ttsButtonRef = useRef<HTMLButtonElement>(null);

    const enabledVoices = config.ttsConfig.availableVoices.filter(voice =>
        config.ttsConfig.enabledVoices[voice as keyof typeof config.ttsConfig.enabledVoices]
    );


    useEffect(() => {
        scrollToBottom();
    }, [clientSideMessages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const scrollToBottom = useCallback(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, []);

    useEffect(() => {
        const initialMessage = {
            id: 'welcome',
            text: config.welcomeMessage,
            isBot: true,
            timestamp: new Date().toISOString(),
            isRead: false
        };
        setClientSideMessages([initialMessage]);
    }, [config.welcomeMessage]);

    useEffect(() => {
        if (config.enableStatus) {
            setAssistantStatus(config.statusConfig.dotStatus || 'online');
        } else {
            setAssistantStatus('online');
        }
    }, [config.enableStatus, config.statusConfig]);


    useEffect(() => {
        if (config.enableStatus) {
            setAssistantStatus(config.statusConfig.dotStatus || 'online');
        } else {
            setAssistantStatus('online');
        }
    }, [config.enableStatus, config.statusConfig]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        setError(null);
        updateLastActivityTime();
    };

    const updateLastActivityTime = useCallback(() => {
        setLastActivityTime(Date.now());
        if (assistantStatus === 'away') {
            setAssistantStatus('online');
        }
    }, [assistantStatus]);

    const simulateTyping = (duration: number): Promise<void> => {
        setIsTyping(true);
        return new Promise(resolve => {
            setTimeout(() => {
                setIsTyping(false);
                resolve();
            }, duration);
        });
    };

    const simulateTTS = useCallback((messageId: string) => {
        setCurrentlyPlayingId(messageId);
        setTimeout(() => {
            setCurrentlyPlayingId(null);
        }, 2000);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() === '' || assistantStatus === 'offline') return;

        updateLastActivityTime();
        setShowFeedback(false);

        const currentTime = new Date().toISOString();

        const userMessage = {
            id: uuidv4(),
            text: input,
            isBot: false,
            timestamp: currentTime,
            isRead: false,
        };

        setClientSideMessages(prev => [...prev, userMessage]);
        setInput('');

        try {
            const typingDuration = Math.random() * 2000 + 1000;
            await simulateTyping(typingDuration);

            // Simulated API call
            const botResponse = "Ceci est une réponse simulée de l'assistant virtuel.";

            const botMessage = {
                id: uuidv4(),
                text: botResponse,
                isBot: true,
                timestamp: new Date().toISOString(),
                isRead: false,
            };

            setClientSideMessages(prev => [...prev, botMessage]);

            if (config.enableTTS) {
                simulateTTS(botMessage.id);
            }

            if (Math.random() < config.feedbackProbability) {
                setShowFeedback(true);
            }

        } catch (error) {
            console.error('Erreur lors de la communication avec le chatbot:', error);
            setError({ type: 'unknown', message: config.ERROR_MESSAGES.unknown });
        }
    };

    const toggleTTSOptions = () => {
        setShowTTSOptions(prev => !prev);
    };

    const replayMessage = (messageId: string, text: string) => {
        if (playingMessageId === messageId) {
            setIsPlaying(false);
            setPlayingMessageId(null);
        } else {
            simulateTTS(messageId);
        }
    };

    useEffect(() => {
        setSelectedVoice(config.ttsConfig.defaultVoice);
        setVolume(config.ttsConfig.defaultVolume);
        setSpeed(config.ttsConfig.defaultSpeed);
    }, [config.ttsConfig.defaultVoice, config.ttsConfig.defaultVolume, config.ttsConfig.defaultSpeed]);

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
    };

    const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSpeed = parseFloat(e.target.value);
        setSpeed(newSpeed);
    };

    const getVolumeIcon = () => {
        if (volume === 0) return <Icons.VolumeX />;
        if (volume < 0.5) return <Icons.Volume1 />;
        return <Icons.Volume2 />;
    };

    const renderMessage = (message: { isBot: boolean; text: string }) => {
        if (message.isBot) {
            return (
                <ReactMarkdown
                    components={{
                        p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2" {...props} />,
                        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                        a: ({ node, ...props }) => <a className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                        code: ({ node, inline, ...props }: { node: any, inline: boolean, [key: string]: any }) =>
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
    };

    const renderTTSIcon = (messageId: string) => {
        if (!config.enableTTS) return null;

        if (!config.ttsConfig.availableVoices.length) {
            return <Icons.VolumeX aria-label="Synthèse vocale désactivée" />;
        }

        if (playingMessageId === messageId) {
            return <Icons.VolumeUp aria-label="Arrêter la lecture" />;
        } else if (currentlyPlayingId === messageId) {
            return <Icons.Volume2 aria-label="En cours de lecture" />;
        } else {
            return <Icons.Volume0 aria-label="Lire le message" />;
        }
    };

    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
    };

    const getThemeStyles = () => {
        if (isDarkMode && config.enableDarkMode) {
            return {
                backgroundColor: config.darkModeConfig.backgroundColor,
                color: config.darkModeConfig.textColor,
                fontSize: config.fontSize, // Ajout de la taille de police ici
            };
        }
        return {
            fontSize: config.fontSize, // Ajout de la taille de police ici aussi
        };
    };


    // Composant des Options TTS
    const TTSOptions = () => (
        <div
            id="tts-options"
            className="w-48 p-4 bg-white rounded-md shadow-lg"
            style={{
                backgroundColor: isDarkMode ? config.darkModeConfig.backgroundColor : 'white',
            }}
        >
            <label className="block mt-2 text-sm font-medium" style={isDarkMode ? { color: config.darkModeConfig.textColor } : { fontSize: config.fontSize, fontFamily: `'${config.fontFamily}', sans-serif` }}>
                Voix
                <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full mt-1 block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    style={isDarkMode ? {
                        backgroundColor: config.darkModeConfig.inputBackgroundColor,
                        color: config.darkModeConfig.inputTextColor,
                        borderColor: config.darkModeConfig.primaryColor
                    } : {}}
                >
                    {enabledVoices.length > 0 ? (
                        enabledVoices.map((voice) => (
                            <option key={voice} value={voice}>{voice}</option>
                        ))
                    ) : (
                        <option value="" disabled>
                            Aucune voix activée
                        </option>
                    )}
                </select>
            </label>

            {config.ttsConfig.enableVolumeControl && (
                <label className="block mt-2 text-sm font-medium" style={isDarkMode ? { color: config.darkModeConfig.textColor } : { fontSize: config.fontSize, fontFamily: `'${config.fontFamily}', sans-serif` }}>
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
                    <span className="text-xs">{(volume * 100).toFixed(0)}%</span>
                </label>
            )}

            {config.ttsConfig.enableSpeedControl && (
                <label className="block mt-2 text-sm font-medium" style={isDarkMode ? { color: config.darkModeConfig.textColor } : { fontSize: config.fontSize, fontFamily: `'${config.fontFamily}', sans-serif` }}>
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
            )}
        </div>
    );

    return (
        <div className="relative w-96 flex items-end flex-col">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="bg-white rounded-lg shadow-xl w-full overflow-hidden"
                        style={{
                            fontFamily: `'${config.fontFamily}', sans-serif`,
                            fontSize: config.fontSize,
                            ...getThemeStyles(),
                        }}
                    >
                        <motion.div
                            className="p-4 flex justify-between items-center"
                            style={{ backgroundColor: config.primaryColor }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex items-center">
                                <div className='flex flex-col'>
                                    <h3 className="font-bold" style={{ color: config.textColor, fontSize: config.fontSize, }}>{config.headerTitle}</h3>
                                    <p className="text-sm opacity-80" style={{ color: config.textColor }}>
                                        {config.STATUS_MESSAGES[assistantStatus]}
                                    </p>
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
                                    <div className="relative ml-2">
                                        <button
                                            onClick={toggleTTSOptions}
                                            className="text-white hover:text-gray-200 transition p-2"
                                            aria-label="Options de synthèse vocale"
                                            aria-expanded={showTTSOptions}
                                            aria-controls="tts-options"
                                            ref={ttsButtonRef}
                                        >
                                            {showTTSOptions ? getVolumeIcon() : (config.ttsToggleIcon || <Icons.TTS />)}
                                        </button>
                                        {showTTSOptions && (
                                            <TTSOptionsPortal isDarkMode={isDarkMode} config={config} parentRef={ttsButtonRef}>
                                                <TTSOptions />
                                            </TTSOptionsPortal>
                                        )}
                                    </div>
                                )}
                                <div className={`ml-2 w-3 h-3 rounded-full ${config.STATUS_COLORS[assistantStatus]}`} aria-hidden="true"></div>
                            </div>
                        </motion.div>

                        <div className="h-96 overflow-y-auto p-4" ref={messagesContainerRef}>
                            <AnimatePresence>
                                {clientSideMessages.map((message) => {
                                    return (
                                        <motion.div
                                            key={message.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className={`mb-4 ${message.isBot ? 'text-left' : 'text-right'}`}
                                        >
                                            <motion.div
                                                className={`inline-block p-3 rounded-2xl max-w-[100%] ${message.isBot ? 'rounded-tl-none' : 'rounded-tr-none'}`}
                                                style={{
                                                    backgroundColor: message.isBot
                                                        ? (isDarkMode ? config.darkModeConfig.messageBackgroundColor : config.botMessageBackgroundColor)
                                                        : (isDarkMode ? config.darkModeConfig.userMessageBackgroundColor : config.userMessageBackgroundColor),
                                                    color: message.isBot
                                                        ? (isDarkMode ? config.darkModeConfig.messageTextColor : config.botMessageTextColor)
                                                        : (isDarkMode ? config.darkModeConfig.userMessageTextColor : config.userMessageTextColor),
                                                    fontSize: config.fontSize, // Ajout de la taille de police ici
                                                }}
                                                whileHover={{ scale: 1.02 }}
                                            >
                                                {renderMessage(message)}
                                            </motion.div>
                                            <div className="text-xs mt-1 flex items-center justify-end">
                                                {config.messageConfig?.enableTimestamp && (
                                                    <time dateTime={message.timestamp}>
                                                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </time>
                                                )}
                                                {!message.isBot && config.messageConfig?.enableReadStatus && (
                                                    <span className="ml-1" aria-label={message.isRead ? "Lu" : "Envoyé"}>
                                                        {message.isRead ? <Icons.CheckCheck /> : <Icons.Check />}
                                                    </span>
                                                )}
                                                {message.isBot && config.enableTTS && (
                                                    <button
                                                        onClick={() => replayMessage(message.id, message.text)}
                                                        className="ml-2 text-blue-500 hover:text-blue-700"
                                                        aria-label={playingMessageId === message.id ? "Arrêter la lecture" : "Lire le message"}
                                                    >
                                                        {renderTTSIcon(message.id)}
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                            <div ref={messagesContainerRef} />
                            {isTyping && config.enableTypingAnimation && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-gray-500 text-sm mb-4"
                                >
                                    <TypingAnimation
                                        enableTypingAnimation={config.enableTypingAnimation}
                                        typingAnimationType={config.typingAnimationType}
                                        typingAnimationColor={config.typingAnimationColor}
                                        typingAnimationSize={config.typingAnimationSize}
                                        typingText={config.typingText}
                                        typingLogo={config.typingLogo}
                                    />
                                </motion.div>
                            )}
                        </div>

                        {error && (
                            <div className="p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                                {error.message}
                            </div>
                        )}

                        {showProactivePrompt && (
                            <div className="p-2 border-t" style={{ borderColor: config.primaryColor }}>
                                <p className="text-sm text-center mb-2">Avez-vous besoin d'aide supplémentaire ?</p>
                                <div className="flex justify-center space-x-2">
                                    <button
                                        onClick={() => setShowProactivePrompt(false)}
                                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                    >
                                        Non, merci
                                    </button>
                                    <button
                                        onClick={() => {
                                            setInput("J'ai besoin d'aide supplémentaire");
                                            handleSubmit({ preventDefault: () => { } } as React.FormEvent);
                                            setShowProactivePrompt(false);
                                        }}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Oui, s'il vous plaît
                                    </button>
                                </div>
                            </div>
                        )}

                        {config.enableSuggestions && config.enableQuickReplies && (
                            <div className="flex flex-wrap justify-center p-2 border-t" style={{ borderColor: config.primaryColor }}>
                                {config.quickReplies.map((reply, index) => (
                                    <motion.button
                                        key={index}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            setInput(reply);
                                            handleSubmit({ preventDefault: () => { } } as React.FormEvent);
                                        }}
                                        className="m-1 px-3 py-1 text-sm rounded-full"
                                        style={{
                                            backgroundColor: isDarkMode ? config.darkModeConfig.suggestionBackgroundColor : config.primaryColor,
                                            color: isDarkMode ? config.darkModeConfig.suggestionTextColor : config.textColor

                                        }}
                                    >
                                        {reply}
                                    </motion.button>
                                ))}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="p-4 border-t" style={{ borderColor: config.primaryColor }}>
                            <div className="flex">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={assistantStatus === 'offline' ? config.offlineText : config.placeholderText}
                                    className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    disabled={assistantStatus === 'offline'}
                                    ref={inputRef}
                                    style={isDarkMode ? {
                                        backgroundColor: config.darkModeConfig.inputBackgroundColor,
                                        color: config.darkModeConfig.inputTextColor,
                                        borderColor: config.darkModeConfig.primaryColor
                                    } : {}}
                                />
                                <motion.button
                                    type="submit"
                                    className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700 transition disabled:opacity-50"
                                    disabled={input.trim() === '' || assistantStatus === 'offline'}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        backgroundColor: isDarkMode ? config.darkModeConfig.buttonBackgroundColor : config.primaryColor,
                                        color: isDarkMode ? config.darkModeConfig.buttonTextColor : 'white'
                                    }}
                                >
                                    {typeof config.sendButtonIcon === 'string' || React.isValidElement(config.sendButtonIcon) ? config.sendButtonIcon : <Icons.Send />}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.button
                onClick={toggleChat}
                className={`bg-blue-600 text-white mt-5 p-3 rounded-full shadow-lg hover:bg-blue-700 transition flex items-center justify-center animate-bounce`}
                aria-label={isOpen ? "Fermer le chat" : "Ouvrir le chat"}
                style={{
                    backgroundColor: isDarkMode ? config.darkModeConfig.primaryColor : config.primaryColor,
                    width: config.openingBubbleWidth,
                    height: config.openingBubbleHeight
                }}
            >
                {React.isValidElement(config.openingBubbleIcon) ? config.openingBubbleIcon : <Icons.MessageCircle aria-hidden="true" />}
            </motion.button>
        </div>
    );
};

export default ChatbotPreview;