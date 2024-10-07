import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';

interface GithubLoginButtonProps {
    onSuccess: () => void;
    onError: (error: string) => void;
}

const GithubLoginButton: React.FC<GithubLoginButtonProps> = ({ onSuccess, onError }) => {
    const { loginWithGithub, user } = useAuth();

    useEffect(() => {
        if (user) {
            onSuccess();
        }
    }, [user]);


    const handleGithubLogin = async () => {
        try {
            await loginWithGithub();
            if (user) {
                onSuccess();
            } else {
                onError('Échec de la connexion. Veuillez vérifier vos identifiants.');
            }
        } catch (err) {
            console.error('Login failed:', err);
            if (err instanceof Error) {
                onError(`Aïe.. Nous avons un problème avec l'authentification avec Github`);
            } else {
                onError('Une erreur inattendue s\'est produite.');
            }
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGithubLogin}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900"
        >
            <FaGithub className="mr-2" size={20} />
            Github
        </motion.button>
    );
};

export default GithubLoginButton;