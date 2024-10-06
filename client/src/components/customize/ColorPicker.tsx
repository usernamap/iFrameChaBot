import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '@/components/common/Icons';
import { Tooltip } from '@/components/ui/Tooltip';

interface ColorPickerProps {
    label: string;
    color: string;
    onChange: (color: string) => void;
    tooltip: string;
    onTooltip: () => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, color, onChange, tooltip }) => {
    const [showPicker, setShowPicker] = useState(false);

    return (
        <div className="relative mb-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                <Tooltip content={tooltip}>
                    <Icons.HelpCircle />
                </Tooltip>
            </div>
            <div className="flex items-center">
                <motion.div
                    className="w-10 h-10 rounded-full cursor-pointer shadow-md"
                    style={{ backgroundColor: color }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowPicker(!showPicker)}
                />
                <motion.span
                    className="ml-3 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {color}
                </motion.span>
            </div>
            <AnimatePresence>
                {showPicker && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-10 mt-2"
                    >
                        <ChromePicker
                            color={color}
                            onChange={(color) => onChange(color.hex)}
                            disableAlpha={true}
                        />
                        <motion.button
                            className="mt-2 w-full bg-primary text-white py-2 rounded flex items-center justify-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowPicker(false)}
                        >
                            <Icons.Check />
                            Appliquer
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ColorPicker;