import React from 'react';
import { motion } from 'framer-motion';
import { Icons } from '@/components/common/Icons';

interface SubscriptionOption {
    name: string;
    price: number;
    features: string[];
    recommended?: boolean;
}

const subscriptionOptions: SubscriptionOption[] = [
    {
        name: "Abonnement Mensuel Standard PME",
        price: 150,
        features: [
            "Jusqu'à 2 000 interactions par mois",
            "Personnalisation de base (branding, ton de la conversation)",
            "Support par email",
            "Disponibilité 24/7"
        ]
    },
    {
        name: "Abonnement Mensuel Pro PME",
        price: 250,
        features: [
            "Jusqu'à 5 000 interactions par mois",
            "Toutes les fonctionnalités de l'abonnement Standard",
            "Rapports et analyses de base",
            "Intégration CRM (Salesforce, HubSpot, etc.)",
            "Support par email et téléphone"
        ],
        recommended: true
    },
    {
        name: "Abonnement Mensuel Premium PME",
        price: 350,
        features: [
            "Jusqu'à 10 000 interactions par mois",
            "Toutes les fonctionnalités de l'abonnement Pro",
            "Personnalisation avancée (scripts de conversation sur mesure)",
            "Intégration TTS (Text-to-Speech) pour interactions vocales",
            "Rapports et analyses avancés",
            "Support prioritaire"
        ]
    }
];

interface SubscriptionOptionsProps {
    onSelect: (option: SubscriptionOption) => void;
    selectedSubscription: SubscriptionOption | null;
}

const SubscriptionOptions: React.FC<SubscriptionOptionsProps> = ({ onSelect, selectedSubscription }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {subscriptionOptions.map((option, index) => (
                <motion.div
                    key={index}
                    className={`bg-white rounded-lg shadow-lg p-6 border-2 relative ${selectedSubscription === option ? 'border-primary' : 'border-transparent'
                        } ${option.recommended ? 'ring-2 ring-secondary' : ''}`}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                >
                    {option.recommended && (
                        <div className="absolute top-0 right-0 bg-secondary text-white px-2 py-1 text-sm rounded-bl-lg rounded-tr-lg">
                            Recommandé
                        </div>
                    )}
                    <h3 className="text-xl font-bold mb-4 text-primary">{option.name}</h3>
                    <p className="text-3xl font-bold mb-6 text-gray-800">{option.price} € <span className="text-sm font-normal text-gray-600">/ mois</span></p>
                    <ul className="mb-6 space-y-2">
                        {option.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start text-gray-700">
                                <Icons.Check />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                    <motion.button
                        className={`w-full py-3 px-4 rounded-full text-lg font-semibold ${selectedSubscription === option
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            } transition-colors duration-300`}
                        onClick={() => onSelect(option)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {selectedSubscription === option ? 'Sélectionné' : 'Choisir ce plan'}
                    </motion.button>
                </motion.div>
            ))}
        </div>
    );
};

export default SubscriptionOptions;