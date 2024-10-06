// SwitchWithLabel.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch'; // Assurez-vous que le chemin est correct
import { Icons } from '@/components/common/Icons';

interface SwitchWithLabelProps {
    label: string;
    id: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    onTooltip: () => void;
}

export const SwitchWithLabel: React.FC<SwitchWithLabelProps> = ({
    label,
    id,
    checked,
    onCheckedChange,
    onTooltip,
}) => {
    return (
        <motion.div
            className="flex items-center justify-between space-x-4 p-4 border border-gray-300 rounded-md bg-white shadow-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center space-x-3">
                <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
                <label htmlFor={id} className="text-sm font-medium text-gray-700 cursor-pointer">
                    {label}
                </label>
            </div>
            <motion.button
                onClick={onTooltip}
                className="text-gray-400 hover:text-gray-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <Icons.HelpCircle />
            </motion.button>
        </motion.div>
    );
};
