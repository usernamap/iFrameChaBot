import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/layout/index';
import DetailedRecapComponent from '@/components/payment/DetailedRecapComponent';
import PaymentSummaryComponent from '@/components/payment/PaymentSummaryComponent';
import SubscriptionOptions from '@/components/payment/SubscriptionOptions';
import TrustFactors from '@/components/payment/TrustFactors';
import { ChatbotConfig, CompanyInfo } from '@/types/index';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Icons } from '@/components/common/Icons';
import usePersistedState from '@/contexts/usePersistedState';
import ContactComponent from '@/components/payment/ContactComponent';

export default function Payment() {
    const [chatbotConfig, setChatbotConfig] = usePersistedState<ChatbotConfig | null>('chatbotConfig', null);
    const [companyInfo, setCompanyInfo] = usePersistedState<CompanyInfo | null>('companyInfo', null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSubscription, setSelectedSubscription] = usePersistedState('selectedSubscription', null);
    const [autoUpgrade, setAutoUpgrade] = usePersistedState('autoUpgrade', false);
    const [showContactModal, setShowContactModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const loadData = () => {
            if (!chatbotConfig || !companyInfo) {
                router.push('/customize');
            } else {
                setIsLoading(false);
            }
        };

        loadData();
    }, [chatbotConfig, companyInfo, router]);

    const handlePaymentSuccess = () => {
        router.push('/success');
    };

    if (isLoading) {
        return (
            <Layout title="Chargement...">
                <div className="flex justify-center items-center h-screen">
                    <LoadingSpinner />
                </div>
            </Layout>
        );
    }

    if (!chatbotConfig || !companyInfo) {
        return (
            <Layout title="Erreur">
                <div className="container mx-auto px-4 py-12">
                    <h1 className="text-3xl font-bold mb-8 text-center">Une erreur s'est produite</h1>
                    <p className="text-center">
                        Les informations nécessaires n'ont pas été trouvées. Veuillez retourner à la page de configuration.
                    </p>
                    <div className="flex justify-center mt-8">
                        <motion.button
                            onClick={() => router.push('/customize')}
                            className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark transition-colors flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Icons.ArrowLeft />
                            Retour à la configuration
                        </motion.button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Finaliser votre commande">
            <div className="container mx-auto px-4 py-12">
                <motion.h1
                    className="text-4xl font-bold mb-8 text-center text-primary"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Votre assistant IA personnalisé vous attend !
                </motion.h1>
                <motion.p
                    className="text-xl text-center mb-12 text-gray-600"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    Choisissez l'abonnement qui correspond le mieux à vos besoins et commencez dès aujourd'hui !
                </motion.p>

                <SubscriptionOptions onSelect={setSelectedSubscription} selectedSubscription={selectedSubscription} />

                <div className="flex flex-col lg:flex-row justify-between gap-8 mb-12">
                    <div className="w-full lg:w-1/2">
                        <DetailedRecapComponent
                            chatbotConfig={chatbotConfig}
                            companyInfo={companyInfo}
                            selectedSubscription={selectedSubscription}
                        />
                    </div>
                    <div className="w-full lg:w-1/2">
                        <PaymentSummaryComponent
                            chatbotConfig={chatbotConfig}
                            companyInfo={companyInfo}
                            selectedSubscription={selectedSubscription}
                            onPaymentSuccess={handlePaymentSuccess}
                            autoUpgrade={autoUpgrade}
                            setAutoUpgrade={setAutoUpgrade}
                        />
                    </div>
                </div>

                <TrustFactors />

                <motion.div
                    className="text-center mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <p className="text-lg mb-4">Vous avez des questions ? Nous sommes là pour vous aider !</p>
                    <motion.button
                        id="contact-us"
                        className="bg-secondary px-6 py-2 rounded-full hover:bg-secondary-dark transition-colors flex items-center mx-auto"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowContactModal(true)}
                        animate={{ opacity: 1 }}
                    >
                        <Icons.Phone />‎‎
                        Contactez-nous
                    </motion.button>
                </motion.div>
            </div>
            <AnimatePresence>
                {showContactModal && (
                    <ContactComponent onClose={() => setShowContactModal(false)} />
                )}
            </AnimatePresence>
        </Layout>
    );
}