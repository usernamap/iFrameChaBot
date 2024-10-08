import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/index';
import DashboardChatbotList from '@/components/dashboard/DashboardChatbotList';
// import { getUserChatbots } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';
import { Chatbot } from '@/types';

export default function Dashboard() {
    const [chatbots, setChatbots] = useState<Chatbot[]>([]);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/');
        } else {
            const fetchChatbots = async () => {
                try {
                    // const userChatbots = await getUserChatbots();
                    // setChatbots(userChatbots);
                } catch (error) {
                    console.error('Error fetching chatbots:', error);
                }
            };
            fetchChatbots();
        }
    }, [user, router]);

    const handleChatbotDeleted = async () => {
        // const updatedChatbots = await getUserChatbots();
        // setChatbots(updatedChatbots);
    };

    if (!user) {
        return null;
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8 text-center">Tableau de bord</h1>
                <DashboardChatbotList chatbots={chatbots} onChatbotDeleted={handleChatbotDeleted} />
            </div>
        </Layout>
    );
}