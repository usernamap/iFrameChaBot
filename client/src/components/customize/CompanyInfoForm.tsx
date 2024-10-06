import React, { useState } from 'react';

interface CompanyInfoFormProps {
    onNextStep: (companyInfo: any) => void;
}

const CompanyInfoForm: React.FC<CompanyInfoFormProps> = ({ onNextStep }) => {
    const [step, setStep] = useState(1);
    const [companyInfo, setCompanyInfo] = useState({
        name: '',
        industry: '',
        description: '',
        products: '',
        services: '',
        targetAudience: '',
        faq: [],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCompanyInfo({ ...companyInfo, [name]: value });
    };

    const handleNextStep = () => {
        if (step < 5) {
            setStep(step + 1);
        } else {
            onNextStep(companyInfo);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            {step === 1 && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Informations de base</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block mb-2">Nom de l'entreprise</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={companyInfo.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div>
                            <label htmlFor="industry" className="block mb-2">Secteur d'activité</label>
                            <input
                                type="text"
                                id="industry"
                                name="industry"
                                value={companyInfo.industry}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                    </div>
                </div>
            )}
            {step === 2 && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Description de l'entreprise</h2>
                    <div>
                        <label htmlFor="description" className="block mb-2">Description détaillée</label>
                        <textarea
                            id="description"
                            name="description"
                            value={companyInfo.description}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            rows={6}
                        />
                    </div>
                </div>
            )}
            {step === 3 && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Produits et services</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="products" className="block mb-2">Produits principaux</label>
                            <textarea
                                id="products"
                                name="products"
                                value={companyInfo.products}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                                rows={4}
                            />
                        </div>
                        <div>
                            <label htmlFor="services" className="block mb-2">Services offerts</label>
                            <textarea
                                id="services"
                                name="services"
                                value={companyInfo.services}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                                rows={4}
                            />
                        </div>
                    </div>
                </div>
            )}
            {step === 4 && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Public cible</h2>
                    <div>
                        <label htmlFor="targetAudience" className="block mb-2">Décrivez votre public cible</label>
                        <textarea
                            id="targetAudience"
                            name="targetAudience"
                            value={companyInfo.targetAudience}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            rows={6}
                        />
                    </div>
                </div>
            )}
            {step === 5 && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">FAQ</h2>
                    <p className="mb-4">Ajoutez les questions fréquemment posées et leurs réponses.</p>
                    {/* Ici, vous pouvez ajouter un composant dynamique pour gérer la FAQ */}
                </div>
            )}
            <div className="mt-8 flex justify-between">
                {step > 1 && (
                    <button
                        onClick={() => setStep(step - 1)}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
                    >
                        Précédent
                    </button>
                )}
                <button
                    onClick={handleNextStep}
                    className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark"
                >
                    {step === 5 ? 'Terminer' : 'Suivant'}
                </button>
            </div>
        </div>
    );
};

export default CompanyInfoForm;