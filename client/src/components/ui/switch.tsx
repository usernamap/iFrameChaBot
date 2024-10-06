// Switch.tsx

import React from 'react';
import { motion } from 'framer-motion';

interface SwitchProps {
    id: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}

export const Switch: React.FC<SwitchProps> = ({ id, checked, onCheckedChange }) => {
    return (
        <button
            id={id}
            role="switch"
            aria-checked={checked}
            onClick={() => onCheckedChange(!checked)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${checked ? 'bg-green-500' : 'bg-gray-300'
                }`}
        >
            <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'
                    }`}
            />
        </button>
    );
};
