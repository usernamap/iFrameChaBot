// src/components/auth/GoogleLoginButton.tsx

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '@/contexts/AuthContext';

interface GoogleLoginButtonProps {
    onSuccess: () => void;
    onError: (error: string) => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onSuccess, onError }) => {
    const { loginWithGoogle, user } = useAuth();

    useEffect(() => {
        if (user) {
            onSuccess();
        }
    }, [user]);

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            if (user) {
                onSuccess();
            } else {
                onError('Échec de la connexion. Veuillez vérifier vos identifiants.');
            }
        } catch (err) {
            console.error('Login failed:', err);
            if (err instanceof Error) {
                onError('Aïe.. Nous avons un problème avec l\'authentification avec Google');
            } else {
                onError('Une erreur inattendue s\'est produite.');
            }
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
            <FcGoogle className="mr-2" size={20} />
            Google
        </motion.button>
    );
};

export default GoogleLoginButton;
