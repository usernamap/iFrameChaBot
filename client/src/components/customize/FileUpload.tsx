import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '@/components/common/Icons';

interface FileUploadProps {
    label: string;
    onChange: (file: File | null) => void;
    onTooltip: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, onChange, onTooltip }) => {
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        onChange(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    return (
        <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <button onClick={onTooltip} className="text-gray-400 hover:text-gray-600">
                    <Icons.HelpCircle />
                </button>
            </div>
            <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <AnimatePresence>
                            {preview ? (
                                <motion.img
                                    src={preview}
                                    alt="Preview"
                                    className="mb-3 w-20 h-20 object-cover rounded"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    transition={{ duration: 0.3 }}
                                />
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <Icons.Upload />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG ou GIF (MAX. 800x400px)</p>
                    </div>
                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
            </div>
            {preview && (
                <motion.button
                    className="mt-2 text-sm text-red-500 hover:text-red-700"
                    onClick={() => {
                        setPreview(null);
                        onChange(null);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Supprimer l'image
                </motion.button>
            )}
        </div>
    );
};

export default FileUpload;