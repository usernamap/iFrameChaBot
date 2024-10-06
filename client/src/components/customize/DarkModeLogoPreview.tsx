// DarkModeLogoPreview.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Icons } from '@/components/common/Icons';
import { ChatbotConfig } from '../../types';

interface DarkModeLogoPreviewProps {
    config: ChatbotConfig;
}

const DarkModeLogoPreview: React.FC<DarkModeLogoPreviewProps> = ({ config }) => {
    const handleSunLogo = () => {
        if (config.darkModeSunLogo) {
            if (typeof config.darkModeSunLogo === 'string') {
                return <img src={config.darkModeSunLogo} alt="Logo Soleil Mode Sombre" className="h-6 w-6" />;
            } else {
                return <img src={URL.createObjectURL(config.darkModeSunLogo)} alt="Logo Soleil Mode Sombre" className="h-6 w-6" />;
            }
        }
        return <Icons.Sun aria-hidden="true" />;
    };

    const handleMoonLogo = () => {
        if (config.darkModeMoonLogo) {
            if (typeof config.darkModeMoonLogo === 'string') {
                return <img src={config.darkModeMoonLogo} alt="Logo Lune Mode Sombre" className="h-6 w-6" />;
            } else {
                return <img src={URL.createObjectURL(config.darkModeMoonLogo)} alt="Logo Lune Mode Sombre" className="h-6 w-6" />;
            }
        }
        return <Icons.Moon aria-hidden="true" />;
    };

    return (
        <div className="flex items-center space-x-4">
            <motion.div
                className="flex items-center justify-center p-2 bg-gray-100 rounded-md shadow-inner"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                {handleSunLogo()}
            </motion.div>
            <motion.div
                className="flex items-center justify-center p-2 bg-gray-100 rounded-md shadow-inner"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                {handleMoonLogo()}
            </motion.div>
        </div>
    );
};

export default DarkModeLogoPreview;