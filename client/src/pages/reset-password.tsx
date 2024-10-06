import { useState } from 'react';
import Layout from '@/components/layout/index';
import { resetPassword } from '@/utils/auth';

export default function ResetPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await resetPassword(email);
            setSuccess('Un email de réinitialisation a été envoyé à votre adresse');
        } catch (err) {
            setError('Erreur lors de la demande de réinitialisation du mot de passe');
        }
    };

    return (
        <Layout title="Réinitialiser le mot de passe">
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8 text-center">Réinitialiser le mot de passe</h1>
                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    {success && <p className="text-green-500 mb-4">{success}</p>}
                    <button type="submit" className="w-full bg-primary text-white px-4 py-2 rounded">
                        Réinitialiser le mot de passe
                    </button>
                </form>
            </div>
        </Layout>
    );
}