import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/index';
import EmailLoginForm from '@/components/auth/EmailLoginForm';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import FacebookLoginButton from '@/components/auth/FacebookLoginButton';
import TwitterLoginButton from '@/components/auth/TwitterLoginButton';
import GithubLoginButton from '@/components/auth/GithubLoginButton';
import MicrosoftLoginButton from '@/components/auth/MicrosoftLoginButton';
import FakeEmailButton from '@/components/auth/FakeEmailButton';

const Login: React.FC = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const handleLoginSuccess = () => {
        router.push('/dashboard');
    };

    const handleLoginError = (errorMessage: string) => {
        setError(errorMessage);
    };

    return (
        <Layout title="Connexion">
            <div className="flex items-center justify-center bg-gray-50 my-6 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Connectez-vous à votre compte
                        </h2>
                    </div>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    <EmailLoginForm onSuccess={handleLoginSuccess} onError={handleLoginError} />
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-50 text-gray-500">Ou continuer avec</span>
                            </div>
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <FakeEmailButton onSuccess={handleLoginSuccess} onError={handleLoginError} />
                            <GoogleLoginButton onSuccess={handleLoginSuccess} onError={handleLoginError} />
                            <FacebookLoginButton onSuccess={handleLoginSuccess} onError={handleLoginError} />
                            <TwitterLoginButton onSuccess={handleLoginSuccess} onError={handleLoginError} />
                            <GithubLoginButton onSuccess={handleLoginSuccess} onError={handleLoginError} />
                            <MicrosoftLoginButton onSuccess={handleLoginSuccess} onError={handleLoginError} />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Login;