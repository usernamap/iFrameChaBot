import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { ChatbotConfig } from '@/types/index';

export const TTSOptionsPortal: React.FC<{
    children: React.ReactNode;
    isDarkMode: boolean;
    config: ChatbotConfig;
    parentRef: React.RefObject<HTMLDivElement>;
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
                zIndex: 1000, // Assurez-vous que le z-index est suffisamment élevé
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
