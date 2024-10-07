import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useAuth } from '@/contexts/AuthContext';
import { ChatbotConfig } from '@/types';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import EmailLoginForm from '@/components/auth/EmailLoginForm';
import FakeEmailButton from '@/components/auth/FakeEmailButton';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import FacebookLoginButton from '@/components/auth/FacebookLoginButton';
import TwitterLoginButton from '@/components/auth/TwitterLoginButton';
import GithubLoginButton from '@/components/auth/GithubLoginButton';
import MicrosoftLoginButton from '@/components/auth/MicrosoftLoginButton';

interface PaymentComponentProps {
    chatbotConfig: ChatbotConfig;
    companyInfo: any;
    onPaymentSuccess: () => void;
}

const PaymentComponent: React.FC<PaymentComponentProps> = ({
    chatbotConfig,
    companyInfo,
    onPaymentSuccess,
}) => {
    // const stripe = useStripe();
    // const elements = useElements();
    const { user } = useAuth();
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const handleLoginSuccess = () => {
        router.push('/dashboard');
    };

    const handleLoginError = (errorMessage: string) => {
        setError(errorMessage);
    };


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setPaymentError(null);

        // if (!stripe || !elements || !user) {
        //     return;
        // }

        setIsProcessing(true);

        // const cardElement = elements.getElement(CardElement);

        // if (cardElement) {
        //     try {
        //         const { error, paymentMethod } = await stripe.createPaymentMethod({
        //             type: 'card',
        //             card: cardElement,
        //         });

        //         if (error) {
        //             setPaymentError(error.message || 'Une erreur est survenue lors du paiement.');
        //         } else {
        //             console.log('[PaymentMethod]', paymentMethod);
        //             // Ici, vous devriez envoyer le paymentMethod.id à votre serveur
        //             // pour effectuer le paiement côté serveur.
        //             // Après confirmation du paiement côté serveur :
        //             onPaymentSuccess();
        //         }
        //     } catch (err) {
        //         setPaymentError('Une erreur inattendue est survenue. Veuillez réessayer.');
        //     } finally {
        //         setIsProcessing(false);
        //     }
        // }
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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
        );
    }

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Paiement</h2>
            <form onSubmit={handleSubmit}>
                {/* <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                    className="mb-6 p-3 border border-gray-300 rounded-md"
                />
                {paymentError && (
                    <p className="text-red-500 mb-4 text-center">{paymentError}</p>
                )}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={!stripe || isProcessing}
                    className={`w-full bg-primary text-white font-semibold py-3 px-4 rounded-md shadow-sm transition duration-300 ${
                        isProcessing || !stripe ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-dark'
                    }`}
                >
                    {isProcessing ? 'Traitement en cours...' : 'Payer'}
                </motion.button> */}
            </form>
        </div>
    );
};

export default PaymentComponent;