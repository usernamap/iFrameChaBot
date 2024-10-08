import React from 'react';
import { motion } from 'framer-motion';
import { ChatbotConfig, CompanyInfo } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Icons } from '@/components/common/Icons';

interface DetailedRecapComponentProps {
    chatbotConfig: ChatbotConfig;
    companyInfo: CompanyInfo | null;
    selectedSubscription: any;
}

const DetailedRecapComponent: React.FC<DetailedRecapComponentProps> = ({ chatbotConfig, companyInfo, selectedSubscription }) => {
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'dd MMMM yyyy', { locale: fr });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
        >
            <h2 className="text-2xl font-bold mb-4 text-primary">Récapitulatif de votre commande</h2>
            <p className="text-sm text-gray-600 mb-4">Date : {formattedDate}</p>

            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-primary">Informations client</h3>
                {companyInfo ? (
                    <>
                        <p><strong>Nom de l'entreprise :</strong> {companyInfo.name}</p>
                        <p><strong>Email :</strong> {companyInfo.contact.email}</p>
                        <p><strong>Secteur d'activité :</strong> {companyInfo.industry}</p>
                    </>
                ) : (
                    <p>Informations client non disponibles</p>
                )}
            </div>

            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-primary">Configuration de votre chatbot</h3>
                <p><strong>Nom du chatbot :</strong> {chatbotConfig.headerTitle}</p>
                <p><strong>Message de bienvenue :</strong> {chatbotConfig.welcomeMessage}</p>
                <p><strong>Couleur principale :</strong> <span className="inline-block w-4 h-4 rounded-full ml-2" style={{ backgroundColor: chatbotConfig.primaryColor }}></span></p>
            </div>

            {selectedSubscription && (
                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-primary">Détails de l'abonnement</h3>
                    <p><strong>Formule :</strong> {selectedSubscription.name}</p>
                    <p><strong>Prix mensuel :</strong> {selectedSubscription.price} €</p>
                    <ul className="list-none mt-2">
                        {selectedSubscription.features.map((feature: string, index: number) => (
                            <li key={index} className="flex items-start mb-2">
                                <Icons.Check />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="font-semibold mb-2 text-blue-800">Informations importantes :</p>
                <ul className="list-disc list-inside text-blue-700">
                    <li>Ce récapitulatif peut être utilisé comme facture pro-forma.</li>
                    <li>Une facture définitive vous sera envoyée par email après le paiement.</li>
                    <li>Vous pouvez annuler votre abonnement à tout moment sans frais.</li>
                </ul>
            </div>
        </motion.div>
    );
};

export default DetailedRecapComponent;