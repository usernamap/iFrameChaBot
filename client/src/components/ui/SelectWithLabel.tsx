// SelectWithLabel.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/input';
import { Icons } from '@/components/common/Icons';

interface SelectWithLabelProps {
    label: string;
    id: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
    onTooltip: () => void;
}

export const SelectWithLabel: React.FC<SelectWithLabelProps> = ({ label, id, value, options, onChange, onTooltip }) => {
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
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner une option" />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </motion.div>
    );
};