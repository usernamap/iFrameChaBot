import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

const faqItems: FAQItem[] = [
    {
        question: "Qu'est-ce qu'un assistant IA personnalisé ?",
        answer: "Un assistant IA personnalisé est un chatbot intelligent qui utilise l'intelligence artificielle pour communiquer avec vos clients de manière naturelle et efficace. Il peut être adapté à votre marque et formé pour répondre aux questions spécifiques de votre entreprise."
    },
    {
        question: "Comment puis-je personnaliser mon assistant IA ?",
        answer: "Notre plateforme vous permet de personnaliser facilement votre assistant IA en choisissant les couleurs, la police, le ton de la conversation, et en fournissant des informations spécifiques à votre entreprise. Vous pouvez également définir des réponses personnalisées pour les questions fréquentes."
    },
    {
        question: "Est-il difficile d'intégrer l'assistant IA à mon site web ?",
        answer: "Pas du tout ! Nous fournissons un code d'intégration simple que vous pouvez copier-coller dans votre site web. Si vous avez besoin d'aide, notre équipe de support est là pour vous guider à chaque étape du processus."
    },
    {
        question: "Puis-je essayer le service avant de m'engager ?",
        answer: "Oui, nous offrons une période d'essai gratuite de 14 jours. Vous pouvez créer votre assistant IA, le personnaliser et le tester sur votre site web sans aucun engagement."
    },
    {
        question: "Comment l'assistant IA améliore-t-il le service client ?",
        answer: "L'assistant IA peut gérer un grand nombre de requêtes simultanément, 24h/24 et 7j/7, ce qui réduit les temps d'attente pour vos clients. Il peut répondre aux questions fréquentes, guider les utilisateurs à travers votre site, et même escalader les problèmes complexes à votre équipe humaine si nécessaire."
    }
];

const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleQuestion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="bg-white py-20">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Questions fréquentes</h2>
                <div className="max-w-3xl mx-auto">
                    {faqItems.map((item, index) => (
                        <div key={index} className="mb-4">
                            <button
                                className="flex justify-between items-center w-full text-left p-4 bg-gray-100 rounded-lg focus:outline-none"
                                onClick={() => toggleQuestion(index)}
                            >
                                <span className="font-semibold">{item.question}</span>
                                {openIndex === index ? (
                                    <ChevronUp className="text-primary" />
                                ) : (
                                    <ChevronDown className="text-primary" />
                                )}
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white p-4 rounded-b-lg shadow-inner"
                                    >
                                        <p>{item.answer}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;