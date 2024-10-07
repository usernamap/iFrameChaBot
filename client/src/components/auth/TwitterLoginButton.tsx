import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTwitter } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';

interface TwitterLoginButtonProps {
    onSuccess: () => void;
    onError: (error: string) => void;
}

const TwitterLoginButton: React.FC<TwitterLoginButtonProps> = ({ onSuccess, onError }) => {
    const { loginWithTwitter, user } = useAuth();

    useEffect(() => {
        if (user) {
            onSuccess();
        }
    }, [user]);

    const handleTwitterLogin = async () => {
        try {
            await loginWithTwitter();
            if (user) {
                onSuccess();
            } else {
                onError('Échec de la connexion. Veuillez vérifier vos identifiants.');
            }
        } catch (err) {
            console.error('Login failed:', err);
            if (err instanceof Error) {
                onError(`Aïe.. Nous avons un problème avec l'authentification avec Twitter`);
            } else {
                onError('Une erreur inattendue s\'est produite.');
            }
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTwitterLogin}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-blue-400 hover:bg-blue-500"
        >
            <FaTwitter className="mr-2" size={20} />
            Twitter
        </motion.button>
    );
};

export default TwitterLoginButton;