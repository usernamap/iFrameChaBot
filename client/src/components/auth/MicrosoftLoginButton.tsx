import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { SiMicrosoft } from 'react-icons/si';
import { useAuth } from '@/contexts/AuthContext';

interface MicrosoftLoginButtonProps {
    onSuccess: () => void;
    onError: (error: string) => void;
}

const MicrosoftLoginButton: React.FC<MicrosoftLoginButtonProps> = ({ onSuccess, onError }) => {
    const { loginWithMicrosoft, user } = useAuth();

    useEffect(() => {
        if (user) {
            onSuccess();
        }
    }, [user]);


    const handleMicrosoftLogin = async () => {
        try {
            await loginWithMicrosoft();
            if (user) {
                onSuccess();
            } else {
                onError('Échec de la connexion. Veuillez vérifier vos identifiants.');
            }
        } catch (err) {
            console.error('Login failed:', err);
            if (err instanceof Error) {
                onError(`Aïe.. Nous avons un problème avec l'authentification avec Microsoft`);
            } else {
                onError('Une erreur inattendue s\'est produite.');
            }
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMicrosoftLogin}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800"
        >
            <SiMicrosoft className="mr-2" size={20} />
            Microsoft
        </motion.button>
    );
};

export default MicrosoftLoginButton;