import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/index';
import RecapAndTestComponent from '@/components/payment/RecapAndTestComponent';
import { ChatbotConfig } from '@/types/index';

export default function RecapAndTest() {
    const [chatbotConfig, setChatbotConfig] = useState<ChatbotConfig | null>(null);
    const [companyInfo, setCompanyInfo] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const storedConfig = localStorage.getItem('chatbotConfig');
        const storedInfo = localStorage.getItem('companyInfo');
        if (storedConfig) setChatbotConfig(JSON.parse(storedConfig));
        if (storedInfo) setCompanyInfo(JSON.parse(storedInfo));
    }, []);

    const handleNextStep = () => {
        router.push('/payment');
    };

    if (!chatbotConfig || !companyInfo) {
        return <div>Chargement...</div>;
    }

    return (
        <Layout title="Récapitulatif et test">
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8 text-center">Récapitulatif et test de votre assistant</h1>
                <RecapAndTestComponent
                    chatbotConfig={chatbotConfig}
                    companyInfo={companyInfo}
                    onNextStep={handleNextStep}
                />
            </div>
        </Layout>
    );
}