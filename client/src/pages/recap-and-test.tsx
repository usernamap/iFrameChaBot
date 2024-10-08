import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/index';
import RecapComponent from '@/components/payment/RecapComponent';
import TestComponent from '@/components/payment/TestComponent';
import { ChatbotConfig, CompanyInfo } from '@/types/index';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function RecapAndTest() {
    const [chatbotConfig, setChatbotConfig] = useState<ChatbotConfig | null>(null);
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        console.log("RecapAndTest: Début du chargement des données");
        const loadData = () => {
            try {
                const storedConfig = localStorage.getItem('chatbotConfig');
                const storedInfo = localStorage.getItem('companyInfo');

                console.log("Données du localStorage :", { storedConfig, storedInfo });

                if (storedConfig && storedInfo) {
                    const parsedConfig = JSON.parse(storedConfig);
                    const parsedInfo = JSON.parse(storedInfo);

                    console.log("Données parsées :", { parsedConfig, parsedInfo });

                    setChatbotConfig(parsedConfig);
                    setCompanyInfo(parsedInfo);
                } else {
                    console.log("Données manquantes dans le localStorage");
                    setError("Données manquantes. Veuillez retourner à la configuration.");
                }
            } catch (err) {
                console.error("Erreur lors du chargement des données :", err);
                setError("Erreur lors du chargement des données.");
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const handleConfigChange = (newConfig: ChatbotConfig) => {
        console.log("Mise à jour de la configuration :", newConfig);
        setChatbotConfig(newConfig);
        localStorage.setItem('chatbotConfig', JSON.stringify(newConfig));
    };

    const handleCompanyInfoChange = (newInfo: CompanyInfo) => {
        console.log("Mise à jour des infos de l'entreprise :", newInfo);
        setCompanyInfo(newInfo);
        localStorage.setItem('companyInfo', JSON.stringify(newInfo));
    };

    const handleNextStep = () => {
        router.push('/payment');
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

    if (error || !chatbotConfig || !companyInfo) {
        return (
            <Layout title="Erreur">
                <div className="container mx-auto px-4 py-12">
                    <h1 className="text-3xl font-bold mb-8 text-center">Une erreur s'est produite</h1>
                    <p className="text-center">
                        {error || "Les informations nécessaires n'ont pas été trouvées."}
                    </p>
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={() => router.push('/customize')}
                            className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark transition-colors"
                        >
                            Retour à la configuration
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    console.log("RecapAndTest: Rendu avec données", { chatbotConfig, companyInfo });

    return (
        <Layout title="Récapitulatif et test">
            <div className="container mx-auto px-4 pb-12">
                <h1 className="text-3xl font-bold mb-8 text-center">Prenez en main votre assistant virtuel</h1>
                <div className="flex justify-between gap-8">
                    <div className="w-full max-w-[45%]">
                        <RecapComponent
                            chatbotConfig={chatbotConfig}
                            companyInfo={companyInfo}
                            onConfigChange={handleConfigChange}
                            onCompanyInfoChange={handleCompanyInfoChange}
                        />
                    </div>
                    <div className="w-full max-w-[45%]">
                        <TestComponent
                            chatbotConfig={chatbotConfig}
                            companyInfo={companyInfo}
                            onNextStep={handleNextStep}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
}