// TypingAnimation.tsx

import React from 'react';
import { motion } from 'framer-motion';

interface TypingAnimationProps {
    enableTypingAnimation: boolean;
    typingAnimationType: 'animation' | 'texte' | 'logo';
    typingText?: string;
    typingLogo?: File | string;
    typingAnimationColor?: string;
    typingAnimationSize?: number;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({
    enableTypingAnimation,
    typingAnimationType,
    typingText = "L'assistant est en train d'écrire...",
    typingLogo,
    typingAnimationColor = '#gray-500',
    typingAnimationSize = 8,
}) => {
    if (!enableTypingAnimation) {
        return null;
    }

    const dotStyle = (delay: number) => ({
        backgroundColor: typingAnimationColor,
        width: `${typingAnimationSize}px`,
        height: `${typingAnimationSize}px`,
        borderRadius: '50%',
    });

    const containerVariants = {
        start: { transition: { staggerChildren: 0.2 } },
        end: { transition: { staggerChildren: 0.2 } },
    };

    const dotVariants = {
        start: { y: "0%" },
        end: { y: "100%" },
    };

    const dotTransition = {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut",
    };

    if (typingAnimationType === 'animation') {
        return (
            <motion.div
                className="flex space-x-1"
                variants={containerVariants}
                initial="start"
                animate="end"
            >
                {[0, 1, 2].map((_, index) => (
                    <motion.span
                        key={index}
                        style={dotStyle(index * 0.2)}
                        variants={dotVariants}
                        transition={dotTransition}
                    />
                ))}
            </motion.div>
        );
    } else if (typingAnimationType === 'texte') {
        return (
            <div className="text-gray-500 text-sm mt-2" aria-live="polite">
                {typingText}
            </div>
        );
    } else if (typingAnimationType === 'logo') {
        return (
            <div className="mt-2" aria-live="polite">
                {typingLogo && (
                    <img
                        src={typeof typingLogo === 'string' ? typingLogo : URL.createObjectURL(typingLogo)}
                        alt="Logo de frappe"
                        className={`h-${typingAnimationSize} w-${typingAnimationSize}`}
                    />
                )}
            </div>
        );
    }
    return null;
};

export default TypingAnimation;