import React from 'react';
import { motion } from 'framer-motion';
import { Icons } from '@/components/common/Icons';
import { FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';

interface ContactOption {
    icon: React.ReactNode;
    label: string;
    value: string;
    action: string;
}

const contactOptions: ContactOption[] = [
    { icon: <FaPhone />, label: 'Téléphone', value: '+33 7 81 50 02 10', action: 'tel:+33781500210' },
    { icon: <FaEnvelope />, label: 'Email', value: 'support@aliatech.com', action: 'mailto:support@aliatech.com' },
    { icon: <Icons.MessageCircle />, label: 'Site principal', value: 'Aliatech.fr', action: 'https://aliatech.fr' },
    { icon: <FaFacebook />, label: 'Facebook Messenger', value: '@aliatech', action: 'https://m.me/aliatech' },
    { icon: <FaTwitter />, label: 'Twitter', value: '@aliatech', action: 'https://twitter.com/aliatech' },
    { icon: <FaInstagram />, label: 'Instagram', value: '@aliatech', action: 'https://instagram.com/aliatech' },
    { icon: <FaLinkedin />, label: 'LinkedIn', value: 'Aliatech', action: 'https://linkedin.com/company/aliatech' },
    { icon: <FaGithub />, label: 'GitHub', value: 'aliatech', action: 'https://github.com/aliatech' },
];

interface ContactComponentProps {
    onClose: () => void;
}

const ContactComponent: React.FC<ContactComponentProps> = ({ onClose }) => {
    const handleOptionClick = (action: string) => {
        window.open(action, '_blank');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-primary">Contactez-nous</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <Icons.X />
                    </button>
                </div>
                <p className="text-gray-600 mb-6">
                    Choisissez votre méthode de contact préférée. Notre équipe est disponible pour vous aider !
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {contactOptions.map((option, index) => (
                        <motion.button
                            key={index}
                            className="flex items-center p-4 rounded-lg transition-colors bg-gray-100 hover:bg-gray-200 text-gray-800"
                            onClick={() => handleOptionClick(option.action)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="mr-4">{option.icon}</div>
                            <div className="text-left">
                                <div className="font-semibold">{option.label}</div>
                                <div className="text-sm">{option.value}</div>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ContactComponent;