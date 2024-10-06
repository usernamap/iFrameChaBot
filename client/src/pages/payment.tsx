import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/index';
import PaymentComponent from '@/components/payment/PaymentComponent';
import { ChatbotConfig } from '@/types/index';

export default function Payment() {
    const [chatbotConfig, setChatbotConfig] = useState<ChatbotConfig | null>(null);
    const [companyInfo, setCompanyInfo] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const storedConfig = localStorage.getItem('chatbotConfig');
        const storedInfo = localStorage.getItem('companyInfo');
        if (storedConfig) setChatbotConfig(JSON.parse(storedConfig));
        if (storedInfo) setCompanyInfo(JSON.parse(storedInfo));
    }, []);

    const handlePaymentSuccess = () => {
        // Ici, vous pouvez ajouter la logique pour traiter le paiement réussi
        router.push('/success');
    };

    if (!chatbotConfig || !companyInfo) {
        return <div>Chargement...</div>;
    }

    return (
        <Layout title="Récapitulatif et paiement">
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8 text-center">Récapitulatif et paiement</h1>
                <PaymentComponent
                    chatbotConfig={chatbotConfig}
                    companyInfo={companyInfo}
                    onPaymentSuccess={handlePaymentSuccess}
                />
            </div>
        </Layout>
    );
}