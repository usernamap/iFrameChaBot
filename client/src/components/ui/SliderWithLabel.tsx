// SliderWithLabel.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/input';
import { Icons } from '@/components/common/Icons';

interface SliderWithLabelProps {
    label: string;
    id: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
    onTooltip: () => void;
}

export const SliderWithLabel: React.FC<SliderWithLabelProps> = ({
    label,
    id,
    value,
    min,
    max,
    step,
    onChange,
    onTooltip
}) => {
    return (
        <motion.div
            className="space-y-4 p-4 border border-gray-300 rounded-md bg-white shadow-sm w-full"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center justify-between">
                <label htmlFor={id} className="text-sm font-semibold text-gray-800">
                    {label}
                </label>
                <motion.button
                    onClick={onTooltip}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Icons.HelpCircle />
                </motion.button>
            </div>
            <Slider
                id={id}
                min={min}
                max={max}
                step={step}
                value={[value]}
                onValueChange={(values) => onChange(values[0])}
                className="mt-2"
            />
            <div className="flex justify-between text-sm text-gray-600">
                <span>{min}</span>
                <motion.span
                    className="text-right font-semibold"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.3 }}
                >
                    {value}
                </motion.span>
                <span>{max}</span>
            </div>
        </motion.div>
    );
};