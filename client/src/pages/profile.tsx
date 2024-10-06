import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/index';
import { useAuth } from '@/contexts/AuthContext';
import { changePassword } from '@/utils/auth';

export default function Profile() {
    const { user } = useAuth();
    const router = useRouter();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    if (!user) {
        router.push('/login');
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

    return (
        <Layout title="Profil">
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8 text-center">Profil</h1>
                <div className="max-w-md mx-auto">
                    <p className="mb-4"><strong>Nom:</strong> {user.name}</p>
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
                        <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
                            Changer le mot de passe
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
}