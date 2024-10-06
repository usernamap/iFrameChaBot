// InputWithLabel.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Input, InputProps } from '@/components/ui/input';
import { Icons } from '@/components/common/Icons';

interface InputWithLabelProps extends Omit<InputProps, 'onChange'> {
    label: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onTooltip: () => void;
}

export const InputWithLabel: React.FC<InputWithLabelProps> = ({ label, id, onChange, onTooltip, ...props }) => {
    return (
        <motion.div
            className="space-y-2 p-4 border border-gray-300 rounded-md bg-white shadow-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center justify-between">
                <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
                <motion.button
                    onClick={onTooltip}
                    className="text-gray-400 hover:text-gray-600"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Icons.HelpCircle />
                </motion.button>
            </div>
            <Input
                id={id}
                onChange={onChange}
                {...props}
                className="transition-all duration-300 focus:ring-2 focus:ring-primary"
            />
        </motion.div>
    );
};