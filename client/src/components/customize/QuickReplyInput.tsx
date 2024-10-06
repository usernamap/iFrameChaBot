import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/common/Icons';
import { Tooltip } from '@/components/ui/Tooltip';

interface QuickReplyInputProps {
    quickReplies: string[];
    onChange: (quickReplies: string[]) => void;
    tooltip: string;
    onTooltip: () => void;
}

const QuickReplyInput: React.FC<QuickReplyInputProps> = ({ quickReplies, onChange, tooltip }) => {
    const [newReply, setNewReply] = useState('');
    const [error, setError] = useState('');

    const addQuickReply = () => {
        if (newReply.trim()) {
            if (quickReplies.length < 5) {
                onChange([...quickReplies, newReply.trim()]);
                setNewReply('');
                setError('');
            } else {
                setError('Vous avez atteint le nombre maximum de réponses rapides (5).');
            }
        } else {
            setError('Veuillez entrer une réponse rapide valide.');
        }
    };

    const removeQuickReply = (index: number) => {
        const updatedReplies = quickReplies.filter((_, i) => i !== index);
        onChange(updatedReplies);
        setError('');
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Réponses rapides</label>
                <Tooltip content={tooltip}>
                    <Icons.HelpCircle />
                </Tooltip>
            </div>
            <AnimatePresence>
                {quickReplies.map((reply, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center"
                    >
                        <Input value={reply} readOnly className="flex-grow" />
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeQuickReply(index)}
                            className="ml-2 p-2 text-red-500 hover:text-red-700"
                        >
                            <Icons.Trash2 />
                        </motion.button>
                    </motion.div>
                ))}
            </AnimatePresence>
            <motion.div
                className="flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Input
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder="Nouvelle réponse rapide"
                    className="flex-grow"
                    onKeyPress={(e) => e.key === 'Enter' && addQuickReply()}
                />
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={addQuickReply}
                    className="ml-2 p-2 text-green-500 hover:text-green-700"
                    disabled={quickReplies.length >= 5}
                >
                    <Icons.Plus />
                </motion.button>
            </motion.div>
            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-sm text-red-500 mt-2"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};

export default QuickReplyInput;