import React from 'react';

const DocumentationComponent: React.FC = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Documentation</h2>
            <ul className="space-y-4">
                <li>
                    <h3 className="text-xl font-semibold">Guide d'intégration</h3>
                    <p>Instructions détaillées pour intégrer le chatbot sur différentes plateformes web.</p>
                </li>
                <li>
                    <h3 className="text-xl font-semibold">Personnalisation avancée</h3>
                    <p>Apprenez à personnaliser davantage l'apparence et le comportement de votre chatbot.</p>
                </li>
                <li>
                    <h3 className="text-xl font-semibold">API et webhooks</h3>
                    <p>Documentation technique pour les développeurs souhaitant étendre les fonctionnalités du chatbot.</p>
                </li>
                <li>
                    <h3 className="text-xl font-semibold">FAQ</h3>
                    <p>Réponses aux questions fréquemment posées sur l'utilisation et la maintenance du chatbot.</p>
                </li>
            </ul>
            <a href="#" className="text-primary hover:underline mt-4 inline-block">Accéder à la documentation complète</a>
        </div>
    );
};

export default DocumentationComponent;