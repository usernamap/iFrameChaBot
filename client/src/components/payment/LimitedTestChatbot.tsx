import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatbotPreview from '@/components/customize/ChatbotPreview';
import { ChatbotConfig } from '@/types';
import { Icons } from '@/components/common/Icons';
import usePersistedState from '@/contexts/usePersistedState';

interface LimitedTestChatbotProps {
    chatbotConfig: ChatbotConfig;
    companyInfo: any;
    onNextStep: () => void;
}

const LimitedTestChatbot: React.FC<LimitedTestChatbotProps> = ({
    chatbotConfig,
    companyInfo,
    onNextStep,
}) => {
    const [messageCount, setMessageCount] = usePersistedState('testChatbotMessageCount', 0);
    const [showTip, setShowTip] = useState(false);
    const MAX_MESSAGES = 20;

    useEffect(() => {
        setShowTip(messageCount === MAX_MESSAGES - 5 || messageCount === MAX_MESSAGES - 2 || messageCount >= MAX_MESSAGES);
    }, [messageCount]);

    const handleMessage = () => {
        if (messageCount < MAX_MESSAGES) {
            setMessageCount(prevCount => Math.min(prevCount + 1, MAX_MESSAGES));
        }
    };

    const getTipMessage = () => {
        if (messageCount === MAX_MESSAGES - 5) return "Plus que 5 messages !";
        if (messageCount === MAX_MESSAGES - 2) return "Attention, 2 messages restants !";
        if (messageCount >= MAX_MESSAGES) return "Limite atteinte. Passez à l'étape suivante !";
        return "";
    };

    const progress = (messageCount / MAX_MESSAGES) * 100;

    return (
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Test de l'Assistant IA</h2>

            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-600">Vous pouvez envoyer encore {MAX_MESSAGES - messageCount} messages</span>
                    <span className="text-sm font-bold text-blue-600">{messageCount}/{MAX_MESSAGES}</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-blue-600"
                        style={{ width: `${progress}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <p className="text-sm text-gray-600 mb-2 text-center mt-1">
                    Testez votre assistant en lui envoyant des messages axés sur votre entreprise.
                </p>
                <p className="text-sm text-gray-600 text-center">
                    (Maximum {MAX_MESSAGES} messages car il s'agit d'une version réelle de l'assistant)
                </p>
            </div>


            <AnimatePresence>
                {showTip && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-r-lg"
                    >
                        <p className="font-bold text-yellow-800">Conseil</p>
                        <p className="text-yellow-700">{getTipMessage()}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-gray-100 p-4 rounded-lg flex justify-center">
                <ChatbotPreview
                    config={chatbotConfig}
                    useRealAPI={true}
                    companyInfo={companyInfo}
                    onMessageSent={handleMessage}
                    disabled={messageCount >= MAX_MESSAGES}
                    maxMessages={MAX_MESSAGES}
                />
            </div>

            {messageCount >= MAX_MESSAGES && (
                <motion.button
                    onClick={onNextStep}
                    className="w-full bg-green-500 text-white px-6 py-3 rounded-lg font-bold text-lg shadow-lg hover:bg-green-600 transition duration-300 ease-in-out flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Passer à l'étape suivante
                    <Icons.ArrowRight />
                </motion.button>
            )}
        </div>
    );
};

export default LimitedTestChatbot;