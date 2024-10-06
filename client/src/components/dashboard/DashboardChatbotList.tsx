import Link from 'next/link';
import { Chatbot } from '@/types/index';
import { deleteChatbot } from '@/utils/api';

interface DashboardChatbotListProps {
    chatbots: Chatbot[];
    onChatbotDeleted: () => void;
}

export default function DashboardChatbotList({ chatbots, onChatbotDeleted }: Readonly<DashboardChatbotListProps>) {
    const handleDelete = async (chatbotId: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce chatbot ?')) {
            try {
                await deleteChatbot(chatbotId);
                onChatbotDeleted();
            } catch (error) {
                console.error('Erreur lors de la suppression du chatbot:', error);
            }
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Vos chatbots</h2>
            {chatbots.length === 0 ? (
                <p>Vous n'avez pas encore créé de chatbot.</p>
            ) : (
                <ul>
                    {chatbots.map((chatbot) => (
                        <li key={chatbot.id} className="mb-4 p-4 border rounded">
                            <h3 className="text-xl font-semibold">{chatbot.name}</h3>
                            <p className="text-gray-600">{chatbot.description}</p>
                            <div className="mt-2">
                                <Link href={`/chatbot/${chatbot.id}/edit`} className="text-primary hover:underline mr-4">
                                    Modifier
                                </Link>
                                <Link href={`/preview/${chatbot.id}`} className="text-primary hover:underline mr-4">
                                    Aperçu
                                </Link>
                                <button
                                    onClick={() => handleDelete(chatbot.id)}
                                    className="text-red-500 hover:underline"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <Link href="/customize" className="bg-primary text-white px-4 py-2 rounded inline-block mt-4">
                Créer un nouveau chatbot
            </Link>
        </div>
    );
}