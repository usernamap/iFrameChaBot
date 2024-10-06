import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/index';
import ChatbotPreview from '@/components/customize/ChatbotPreview';
import { getChatbotConfig } from '@/utils/api';
import { ChatbotConfig } from '@/types';

export default function Preview() {
    const [chatbotConfig, setChatbotConfig] = useState<ChatbotConfig | null>(null);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        const fetchConfig = async () => {
            if (id) {
                const config = await getChatbotConfig(id as string);
                setChatbotConfig(config);
            }
        };
        fetchConfig();
    }, [id]);

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8 text-center">Prévisualisation du chatbot</h1>
                {chatbotConfig && <ChatbotPreview config={chatbotConfig} />}
            </div>
        </Layout>
    );
}