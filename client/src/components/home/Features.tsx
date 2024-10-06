import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Palette, Zap } from 'lucide-react';

const features = [
    {
        id: 'feature-1',
        icon: <MessageCircle size={32} />,
        title: 'Conversations naturelles',
        description: 'Notre IA avancée permet des échanges fluides et naturels avec vos utilisateurs.',
    },
    {
        id: 'feature-2',
        icon: <Palette size={32} />,
        title: 'Personnalisation complète',
        description: 'Adaptez l\'apparence et le comportement de votre chatbot à votre image de marque.',
    },
    {
        id: 'feature-3',
        icon: <Zap size={32} />,
        title: 'Intégration facile',
        description: 'Intégrez votre chatbot à votre site web en quelques minutes avec notre code d\'intégration.',
    },
];

const Features: React.FC = () => {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Fonctionnalités clés</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white p-6 rounded-lg shadow-md"
                        >
                            <div className="text-primary mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;