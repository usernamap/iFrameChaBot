import React from 'react';
import { motion } from 'framer-motion';
import { Icons } from '@/components/common/Icons';

const TrustFactors: React.FC = () => {
    const trustFactors = [
        {
            icon: <Icons.Shield />,
            title: "Sécurité garantie",
            description: "Vos données sont protégées par un cryptage de bout en bout"
        },
        {
            icon: <Icons.Users />,
            title: "Plus de 10 000 clients satisfaits",
            description: "Rejoignez des milliers d'entreprises qui nous font confiance"
        },
        {
            icon: <Icons.Clock />,
            title: "Support 24/7",
            description: "Notre équipe est disponible à tout moment pour vous aider"
        },
        {
            icon: <Icons.Star />,
            title: "Note moyenne de 4.9/5",
            description: "Basée sur plus de 1000 avis clients vérifiés"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {trustFactors.map((factor, index) => (
                <motion.div
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-md text-center border border-gray-200 hover:border-primary transition-colors duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                >
                    <div className="text-primary text-4xl mb-4 flex justify-center">{factor.icon}</div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">{factor.title}</h3>
                    <p className="text-sm text-gray-600">{factor.description}</p>
                </motion.div>
            ))}
        </div>
    );
};

export default TrustFactors;