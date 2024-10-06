import React from 'react';
import { motion } from 'framer-motion';
import { Icons } from '@/components/common/Icons';
import { ChatbotConfig } from '@/types/index';

interface OpeningBubbleProps {
    config: ChatbotConfig;
    toggleChat: () => void;
    isOpen: boolean;
    isMobile: boolean;
    isButtonClicked: boolean;
}

const OpeningBubble: React.FC<OpeningBubbleProps> = ({
    config,
    toggleChat,
    isOpen,
    isMobile,
    isButtonClicked,
}) => {
    const handleIcon = () => {
        if (config.openingBubbleIcon) {
            if (typeof config.openingBubbleIcon === 'string') {
                return <img src={config.openingBubbleIcon} alt="Icône du chat" className="h-6 w-6" />;
            } else {
                return <img src={URL.createObjectURL(config.openingBubbleIcon)} alt="Icône du chat" className="h-6 w-6" />;
            }
        }
        return <Icons.MessageCircle />;
    };

    const bubbleVariants = {
        initial: { scale: 0 },
        animate: { scale: 1 },
        tap: { scale: 0.9 },
        hover: { scale: 1.1 },
    };

    return (
        <motion.button
            onClick={toggleChat}
            className={`text-white p-3 rounded-full shadow-lg flex items-center justify-center ${config.animateOpenClose && !isButtonClicked ? 'animate-bounce' : ''}`}
            aria-label={isOpen ? "Fermer le chat" : "Ouvrir le chat"}
            style={{
                backgroundColor: config.openingBubbleColor || '#1D4ED8',
                width: isMobile ? '48px' : config.openingBubbleWidth || '60px',
                height: isMobile ? '48px' : config.openingBubbleHeight || '60px',
            }}
            variants={bubbleVariants}
            initial="initial"
            animate="animate"
            whileTap="tap"
            whileHover="hover"
        >
            {handleIcon()}
        </motion.button>
    );
};

export default OpeningBubble;