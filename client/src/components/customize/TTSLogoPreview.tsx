// TTSLogoPreview.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Icons } from '@/components/common/Icons';
import { ChatbotConfig } from '../../types';

interface TTSLogoPreviewProps {
    config: ChatbotConfig;
}

const TTSLogoPreview: React.FC<TTSLogoPreviewProps> = ({ config }) => {
    const handleTTSLogo = () => {
        if (config.ttsLogo) {
            if (typeof config.ttsLogo === 'string') {
                return <img src={config.ttsLogo} alt="Logo TTS" className="h-6 w-6" />;
            } else {
                return <img src={URL.createObjectURL(config.ttsLogo)} alt="Logo TTS" className="h-6 w-6" />;
            }
        }
        return <Icons.VolumeUp aria-hidden="true" />;
    };

    return (
        <motion.div
            className="flex items-center justify-center p-2 bg-gray-100 rounded-md shadow-inner"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
            {handleTTSLogo()}
        </motion.div>
    );
};

export default TTSLogoPreview;