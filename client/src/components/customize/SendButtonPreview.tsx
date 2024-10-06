import React from 'react';
import { motion } from 'framer-motion';
import { Icons } from '@/components/common/Icons';
import { ChatbotConfig } from '@/types/index';

interface SendButtonPreviewProps {
    config: ChatbotConfig;
}

const SendButtonPreview: React.FC<SendButtonPreviewProps> = ({ config }) => {
    const handleIcon = () => {
        if (config.sendButtonIcon) {
            if (typeof config.sendButtonIcon === 'string') {
                return <img src={config.sendButtonIcon} alt="Icône du bouton d'envoi" className="h-6 w-6" />;
            } else {
                return <img src={URL.createObjectURL(config.sendButtonIcon)} alt="Icône du bouton d'envoi" className="h-6 w-6" />;
            }
        }
        return <Icons.Send />;
    };

    return (
        <div className="flex items-center justify-center p-4 bg-gray-100 rounded-md shadow-inner">
            <motion.button
                className="p-3 rounded-full hover:shadow-lg transition-shadow duration-300 flex items-center justify-center"
                aria-label="Envoyer"
                style={{
                    backgroundColor: config.primaryColor || '#1D4ED8',
                    width: '48px',
                    height: '48px',
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                {handleIcon()}
            </motion.button>
        </div>
    );
};

export default SendButtonPreview;