import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/index';
import RecapComponent from '@/components/payment/RecapComponent';
import TestComponent from '@/components/payment/TestComponent';
import { ChatbotConfig, CompanyInfo } from '@/types/index';
import usePersistedState from '@/contexts/usePersistedState';

export default function RecapAndTest() {
    const [chatbotConfig, setChatbotConfig] = usePersistedState<ChatbotConfig>('chatbotConfig', null);
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedConfig = localStorage.getItem('chatbotConfig');
        const storedInfo = localStorage.getItem('companyInfo');
        if (storedConfig) setChatbotConfig(JSON.parse(storedConfig));
        if (storedInfo) setCompanyInfo(JSON.parse(storedInfo));
    }, []);

    const handleConfigChange = (newConfig: ChatbotConfig) => {
        setChatbotConfig(newConfig);
        localStorage.setItem('chatbotConfig', JSON.stringify(newConfig));
    };

    const handleCompanyInfoChange = (newInfo: CompanyInfo) => {
        setCompanyInfo(newInfo);
        localStorage.setItem('companyInfo', JSON.stringify(newInfo));
    };

    const handleNextStep = () => {
        router.push('/payment');
    };

    if (!chatbotConfig || !companyInfo) {
        return <div>Chargement...</div>;
    }

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