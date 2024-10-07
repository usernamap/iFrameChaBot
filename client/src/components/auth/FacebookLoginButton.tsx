import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFacebook } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';

interface FacebookLoginButtonProps {
    onSuccess: () => void;
    onError: (error: string) => void;
}

const FacebookLoginButton: React.FC<FacebookLoginButtonProps> = ({ onSuccess, onError }) => {
    const { loginWithFacebook, user } = useAuth();

    useEffect(() => {
        if (user) {
            onSuccess();
        }
    }, [user]);

    const handleFacebookLogin = async () => {
        try {
            await loginWithFacebook();
            if (user) {
                onSuccess();
            } else {
                onError('Échec de la connexion. Veuillez vérifier vos identifiants.');
            }
        } catch (err) {
            console.error('Login failed:', err);
            if (err instanceof Error) {
                onError(`Aïe.. Nous avons un problème avec l'authentification avec Facebook`);
            } else {
                onError('Une erreur inattendue s\'est produite.');
            }
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFacebookLogin}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
            <FaFacebook className="mr-2" size={20} />
            Facebook
        </motion.button>
    );
};

export default FacebookLoginButton;