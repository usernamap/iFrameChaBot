import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/index';
import { useAuth } from '@/contexts/AuthContext';
import { changePassword } from '@/utils/auth';
import { motion } from 'framer-motion';
import { Icons } from '@/components/common/Icons';

export default function Profile() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    if (!user) {
        router.push('/');
        return null;
    }

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await changePassword(oldPassword, newPassword);
            setSuccess('Mot de passe changé avec succès');
            setOldPassword('');
            setNewPassword('');
        } catch (err) {
            setError('Erreur lors du changement de mot de passe');
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/'); // Redirige vers la page d'accueil après la déconnexion
        } catch (err) {
            setError('Erreur lors de la déconnexion');
        }
    };

    return (
        <Layout title="Profil">
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8 text-center">Profil</h1>
                <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
                    <p className="mb-4"><strong>Nom:</strong> {user.displayName}</p>
                    <p className="mb-4"><strong>Email:</strong> {user.email}</p>
                    <h2 className="text-2xl font-bold mt-8 mb-4">Changer le mot de passe</h2>
                    <form onSubmit={handleChangePassword}>
                        <div className="mb-4">
                            <label htmlFor="oldPassword" className="block mb-2">Ancien mot de passe</label>
                            <input
                                type="password"
                                id="oldPassword"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="newPassword" className="block mb-2">Nouveau mot de passe</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        {success && <p className="text-green-500 mb-4">{success}</p>}
                        <motion.button
                            type="submit"
                            className="bg-primary text-white px-4 py-2 rounded w-full mb-4"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Changer le mot de passe
                        </motion.button>
                    </form>
                    <motion.button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded w-full flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Icons.LogOut />
                        Se déconnecter
                    </motion.button>
                </div>
            </div>
        </Layout>
    );
}