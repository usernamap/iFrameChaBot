import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, delay = 300 }) => {
    const [isVisible, setIsVisible] = useState(false);
    let timeout: NodeJS.Timeout;

    const showTooltip = () => {
        timeout = setTimeout(() => {
            setIsVisible(true);
        }, delay);
    };

    const hideTooltip = () => {
        clearTimeout(timeout);
        setIsVisible(false);
    };

    return (
        <div className="relative inline-block">
            <div
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
                onFocus={showTooltip}
                onBlur={hideTooltip}
            >
                {children}
            </div>
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-md shadow-sm dark:bg-gray-700"
                        style={{
                            top: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            marginTop: '0.5rem',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {content}
                        <div
                            className="absolute w-3 h-3 bg-gray-900 dark:bg-gray-700"
                            style={{
                                top: '-6px',
                                left: '50%',
                                transform: 'translateX(-50%) rotate(45deg)',
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Tooltip;