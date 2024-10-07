import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { HiOutlineMail } from 'react-icons/hi';
import { on } from 'events';

interface FacebookLoginButtonProps {
    onSuccess: () => void;
    onError: (error: string) => void;

}

const FacebookLoginButton: React.FC<FacebookLoginButtonProps> = ({ onSuccess, onError }) => {
    const { loginWithEmail, user } = useAuth();
    const email = ' ';
    const password = ' ';

    useEffect(() => {
        if (user) {
            onSuccess();
        }
    }, [user]);

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await loginWithEmail(email, password);
            if (user) {
                onSuccess();
            } else {
                onError('Échec de la connexion. Veuillez vérifier vos identifiants.');
            } if (user) {
                onSuccess();
            } else {
                onError('Échec de la connexion. Veuillez vérifier vos identifiants.');
            }
        } catch (err) {
            console.error('Login failed:', err);
            if (err instanceof Error) {
                onError(`Aïe.. Nous avons un problème avec l'authentification par email`);
            } else {
                onError('Une erreur inattendue s\'est produite.');
            }
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEmailLogin}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
            <HiOutlineMail className="mr-2" size={20} />
            Email
        </motion.button>
    );
};

export default FacebookLoginButton;