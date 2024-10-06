import React, { useState } from 'react';

const SupportComponent: React.FC = () => {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    const handleSelectPlan = (plan: string) => {
        setSelectedPlan(plan);
        // Ici, vous pouvez ajouter la logique pour rediriger vers le paiement ou ouvrir un modal de paiement
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Assistance de mise en place</h2>
            <p className="mb-4">Choisissez un plan d'assistance pour bénéficier de l'aide de nos experts :</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border p-4 rounded">
                    <h3 className="text-xl font-semibold mb-2">Plan Basic</h3>
                    <ul className="list-disc list-inside mb-4">
                        <li>Assistance par email</li>
                        <li>Temps de réponse sous 48h</li>
                        <li>1 session de support de 30 minutes</li>
                    </ul>
                    <p className="font-bold mb-2">49€</p>
                    <button
                        onClick={() => handleSelectPlan('basic')}
                        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark w-full"
                    >
                        Choisir
                    </button>
                </div>
                <div className="border p-4 rounded">
                    <h3 className="text-xl font-semibold mb-2">Plan Standard</h3>
                    <ul className="list-disc list-inside mb-4">
                        <li>Assistance par email et chat</li>
                        <li>Temps de réponse sous 24h</li>
                        <li>2 sessions de support de 30 minutes</li>
                    </ul>
                    <p className="font-bold mb-2">99€</p>
                    <button
                        onClick={() => handleSelectPlan('standard')}
                        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark w-full"
                    >
                        Choisir
                    </button>
                </div>
                <div className="border p-4 rounded">
                    <h3 className="text-xl font-semibold mb-2">Plan Premium</h3>
                    <ul className="list-disc list-inside mb-4">
                        <li>Assistance prioritaire par email, chat et téléphone</li>
                        <li>Temps de réponse sous 4h</li>
                        <li>Installation complète par nos experts</li>
                    </ul>
                    <p className="font-bold mb-2">199€</p>
                    <button
                        onClick={() => handleSelectPlan('premium')}
                        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark w-full"
                    >
                        Choisir
                    </button>
                </div>
            </div>
            {selectedPlan && (
                <p className="mt-4 text-center">
                    Vous avez sélectionné le plan {selectedPlan}. Cliquez ici pour procéder au paiement.
                </p>
            )}
        </div>
    );
};

export default SupportComponent;