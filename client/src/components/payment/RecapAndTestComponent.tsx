import React, { useState } from 'react';
import ChatbotPreview from '@/components/customize/ChatbotPreview';
import { ChatbotConfig } from '@/types';

interface RecapAndTestComponentProps {
    chatbotConfig: ChatbotConfig;
    companyInfo: any;
    onNextStep: () => void;
}

const RecapAndTestComponent: React.FC<RecapAndTestComponentProps> = ({
    chatbotConfig,
    companyInfo,
    onNextStep,
}) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        // Ici, vous pouvez ajouter la logique pour sauvegarder les modifications
    };

    return (
        <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2">
                <h2 className="text-2xl font-bold mb-4">Récapitulatif</h2>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-xl font-semibold">Configuration du chatbot</h3>
                        <p>Couleur principale : {chatbotConfig.primaryColor}</p>
                        <p>Police : {chatbotConfig.fontFamily}</p>
                        <p>Message de bienvenue : {chatbotConfig.welcomeMessage}</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">Informations de l'entreprise</h3>
                        <p>Nom : {companyInfo.name}</p>
                        <p>Secteur : {companyInfo.industry}</p>
                        <p>Description : {companyInfo.description}</p>
                    </div>
                </div>
                {!isEditing ? (
                    <button
                        onClick={handleEdit}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Modifier
                    </button>
                ) : (
                    <button
                        onClick={handleSave}
                        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Sauvegarder
                    </button>
                )}
            </div>
            <div className="w-full md:w-1/2">
                <h2 className="text-2xl font-bold mb-4">Testez votre assistant</h2>
                <ChatbotPreview config={chatbotConfig} />
            </div>
            <button
                onClick={onNextStep}
                className="mt-8 bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark"
            >
                Passer au paiement
            </button>
        </div>
    );
};

export default RecapAndTestComponent;