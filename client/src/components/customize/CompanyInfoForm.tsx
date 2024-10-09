import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Icons } from '@/components/common/Icons';
import { Tooltip } from '@/components/ui/Tooltip';
import { CompanyInfo } from '@/types';
import usePersistedState from '@/contexts/usePersistedState';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ProgressBar from '@/components/ui/ProgressBar';
import Link from 'next/link';


interface CompanyInfoFormProps {
    onNextStep: (companyInfo: CompanyInfo) => void;
    hasVisitedRecap: boolean;
}

const CompanyInfoForm: React.FC<CompanyInfoFormProps> = ({ onNextStep, hasVisitedRecap }) => {
    const [activeTab, setActiveTab] = usePersistedState('companyInfoActiveTab', 'informations-base');
    const [lastCompletedTab, setLastCompletedTab] = usePersistedState('lastCompletedTab', 'informations-base');
    const [maxReachedTab, setMaxReachedTab] = usePersistedState('companyInfoMaxReachedTab', 'informations-base');
    const [isHydrated, setIsHydrated] = useState(false);
    const [companyInfo, setCompanyInfo] = usePersistedState<CompanyInfo>('companyInfo', {
        name: "",
        industry: "",
        description: "",
        location: "",
        website: "",
        contact: {
            phone: "",
            email: ""
        },
        services: [],
        targetAudience: [],
        competitors: [],
        brandVoice: "",
        frequentlyAskedQuestions: [],
        values: [],
        socialMediaLinks: {
            facebook: "",
            twitter: "",
            linkedin: "",
            instagram: ""
        },
        policies: {
            privacyPolicy: "",
            returnPolicy: "",
            termsOfService: ""
        },
        testimonials: [],
        team: [],
        locationDetails: {
            mainOffice: {
                address: "",
                hours: []
            },
            branches: []
        },
        otherInfo: {
            companyHistory: "",
            companyCulture: "",
            certificationsAwards: [],
            futureProjects: [],
            additionalInfo: ""
        }
    });

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        console.log("hasVisitedRecap:", hasVisitedRecap);
    }, [hasVisitedRecap]);

    if (!isHydrated) {
        return null;
    }

    const tabOrder = [
        'informations-base',
        'contact-reseaux-sociaux',
        'services-public-cible',
        'marque-valeurs',
        'faq-temoignages',
        'politiques',
        'equipe-localisations',
        'informations-supplementaires'
    ];

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        const currentIndex = tabOrder.indexOf(value);
        const maxReachedIndex = tabOrder.indexOf(maxReachedTab);
        if (currentIndex > maxReachedIndex) {
            setMaxReachedTab(value);
        }
    };

    const isTabDisabled = (tab: string) => {
        const maxReachedIndex = tabOrder.indexOf(maxReachedTab);
        const tabIndex = tabOrder.indexOf(tab);
        return tabIndex > maxReachedIndex + 1;
    };

    const handleNextStep = () => {
        const currentIndex = tabOrder.indexOf(activeTab);
        if (currentIndex < tabOrder.length - 1) {
            const nextTab = tabOrder[currentIndex + 1];
            setActiveTab(nextTab);
            setMaxReachedTab(nextTab);
        } else {
            onNextStep(companyInfo);
        }
    };

    const handlePrevStep = () => {
        const currentIndex = tabOrder.indexOf(activeTab);
        if (currentIndex > 0) {
            setActiveTab(tabOrder[currentIndex - 1]);
        }
    };

    const calculateProgress = (tab: string) => {
        const index = tabOrder.indexOf(tab);
        return ((index + 1) / tabOrder.length) * 100;
    };

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
            <ProgressBar
                currentProgress={calculateProgress(activeTab)}
                maxProgress={calculateProgress(maxReachedTab)}
            />
            <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="grid grid-cols-4 gap-2 mb-8">
                    {tabOrder.map((tab) => (
                        <TabsTrigger
                            key={tab}
                            value={tab}
                            disabled={isTabDisabled(tab)}
                            className={`p-2 rounded-md transition-all ${isTabDisabled(tab) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                        >
                            {getTabLabel(tab)}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <AnimatePresence mode="wait">
                    {tabOrder.map((tab) => (
                        <TabsContent key={tab} value={tab}>
                            {activeTab === tab && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {renderTabContent(tab, companyInfo, setCompanyInfo)}
                                </motion.div>
                            )}
                        </TabsContent>
                    ))}
                </AnimatePresence>
            </Tabs>


            <div className="mt-8 flex justify-between items-center">
                <div>
                    {activeTab !== tabOrder[0] && (
                        <motion.button
                            onClick={handlePrevStep}
                            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-400 transition-colors flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Icons.ArrowLeft />
                            Précédent
                        </motion.button>
                    )}
                </div>

                <Link href="/mentions-legales" passHref>
                    <motion.button
                        className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Mentions légales
                    </motion.button>
                </Link>

                <div>
                    {activeTab !== tabOrder[tabOrder.length - 1] ? (
                        <motion.button
                            onClick={handleNextStep}
                            className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark transition-colors flex items-center pulse-animation"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Suivant
                            <Icons.ArrowRight />
                        </motion.button>
                    ) : (
                        hasVisitedRecap && (
                            <Link href="/recap-and-test" passHref>
                                <motion.button
                                    className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors flex items-center pulse-animation"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Icons.Check />
                                    Allez au récapitulatif
                                </motion.button>
                            </Link>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};


// Fonctions utilitaires et composants

const getTabLabel = (tab: string): string => {
    const labels: { [key: string]: string } = {
        'informations-base': 'Informations de base',
        'contact-reseaux-sociaux': 'Contact et Réseaux sociaux',
        'services-public-cible': 'Services et Public cible',
        'marque-valeurs': 'Marque et Valeurs',
        'faq-temoignages': 'FAQ et Témoignages',
        'politiques': 'Politiques',
        'equipe-localisations': 'Équipe et Localisations',
        'informations-supplementaires': 'Informations supplémentaires'
    };
    return labels[tab] || tab;
};

const renderTabContent = (tab: string, companyInfo: CompanyInfo, setCompanyInfo: React.Dispatch<React.SetStateAction<CompanyInfo>>) => {
    switch (tab) {
        case 'informations-base':
            return <InformationsBaseStep companyInfo={companyInfo} setCompanyInfo={setCompanyInfo} />;
        case 'contact-reseaux-sociaux':
            return <ContactReseauxSociauxStep companyInfo={companyInfo} setCompanyInfo={setCompanyInfo} />;
        case 'services-public-cible':
            return <ServicesPublicCibleStep companyInfo={companyInfo} setCompanyInfo={setCompanyInfo} />;
        case 'marque-valeurs':
            return <MarqueValeursStep companyInfo={companyInfo} setCompanyInfo={setCompanyInfo} />;
        case 'faq-temoignages':
            return <FAQTemoignagesStep companyInfo={companyInfo} setCompanyInfo={setCompanyInfo} />;
        case 'politiques':
            return <PolitiquesStep companyInfo={companyInfo} setCompanyInfo={setCompanyInfo} />;
        case 'equipe-localisations':
            return <EquipeLocalisationsStep companyInfo={companyInfo} setCompanyInfo={setCompanyInfo} />;
        case 'informations-supplementaires':
            return <InformationsSupplementairesStep companyInfo={companyInfo} setCompanyInfo={setCompanyInfo} />;
        default:
            return null;
    }
};

// Composants pour chaque étape
const InformationsBaseStep: React.FC<{
    companyInfo: CompanyInfo;
    setCompanyInfo: React.Dispatch<React.SetStateAction<CompanyInfo>>;
}> = ({ companyInfo, setCompanyInfo }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-6"
    >
        <h2 className="text-2xl font-bold mb-6" style={{ marginTop: '4em', marginBottom: '2em', textAlign: 'center' }}>Informations de base</h2>
        <InfoBubble message="Ces informations constituent le fondement de l'identité de votre entreprise. Plus vous les détaillez, plus votre assistant virtuel sera précis dans ses interactions." />

        <InputWithTooltip
            label="Nom de l'entreprise"
            name="name"
            value={companyInfo.name}
            onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
            tooltip="Saisissez le nom officiel de votre entreprise tel qu'il apparaît sur vos documents légaux."
            placeholder="Ex: Aliatech Solutions"
        />

        <InputWithTooltip
            label="Secteur d'activité"
            name="industry"
            value={companyInfo.industry}
            onChange={(e) => setCompanyInfo({ ...companyInfo, industry: e.target.value })}
            tooltip="Indiquez le domaine principal dans lequel votre entreprise opère."
            placeholder="Ex: Technologies de l'information"
        />

        <TextareaWithTooltip
            label="Description de l'entreprise"
            name="description"
            value={companyInfo.description}
            onChange={(e) => setCompanyInfo({ ...companyInfo, description: e.target.value })}
            tooltip="Décrivez brièvement l'activité principale de votre entreprise, sa mission et sa vision."
            placeholder="Ex: Aliatech Solutions développe des solutions innovantes d'intelligence artificielle pour optimiser les processus métier des entreprises."
        />

        <InputWithTooltip
            label="Localisation principale"
            name="location"
            value={companyInfo.location}
            onChange={(e) => setCompanyInfo({ ...companyInfo, location: e.target.value })}
            tooltip="Indiquez la ville et le pays où se trouve le siège social de votre entreprise."
            placeholder="Ex: Paris, France"
        />

        <InputWithTooltip
            label="Site web"
            name="website"
            value={companyInfo.website}
            onChange={(e) => setCompanyInfo({ ...companyInfo, website: e.target.value })}
            tooltip="Saisissez l'URL complète du site web officiel de votre entreprise."
            placeholder="Ex: https://www.aliatech.fr"
        />
    </motion.div>
);

const ContactReseauxSociauxStep: React.FC<{
    companyInfo: CompanyInfo;
    setCompanyInfo: React.Dispatch<React.SetStateAction<CompanyInfo>>;
}> = ({ companyInfo, setCompanyInfo }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-6"
    >
        <h2 className="text-2xl font-bold mb-6" style={{ marginTop: '4em', marginBottom: '2em', textAlign: 'center' }}>Contact et Réseaux sociaux</h2>
        <InfoBubble message="Ces informations permettront à votre assistant virtuel de fournir les bonnes coordonnées aux clients et de les diriger vers vos présences en ligne." />

        <InputWithTooltip
            label="Téléphone"
            name="phone"
            value={companyInfo.contact.phone}
            onChange={(e) => setCompanyInfo({ ...companyInfo, contact: { ...companyInfo.contact, phone: e.target.value } })}
            tooltip="Numéro de téléphone principal pour les clients."
            placeholder="Ex: +33 1 23 45 67 89"
        />

        <InputWithTooltip
            label="Email"
            name="email"
            value={companyInfo.contact.email}
            onChange={(e) => setCompanyInfo({ ...companyInfo, contact: { ...companyInfo.contact, email: e.target.value } })}
            tooltip="Adresse email principale pour les contacts clients."
            placeholder="Ex: contact@aliatech.fr"
        />

        <InputWithTooltip
            label="Facebook"
            name="facebook"
            value={companyInfo.socialMediaLinks.facebook}
            onChange={(e) => setCompanyInfo({ ...companyInfo, socialMediaLinks: { ...companyInfo.socialMediaLinks, facebook: e.target.value } })}
            tooltip="URL de votre page Facebook professionnelle."
            placeholder="Ex: https://www.facebook.com/AliatechSolutions"
        />

        <InputWithTooltip
            label="Twitter"
            name="twitter"
            value={companyInfo.socialMediaLinks.twitter}
            onChange={(e) => setCompanyInfo({ ...companyInfo, socialMediaLinks: { ...companyInfo.socialMediaLinks, twitter: e.target.value } })}
            tooltip="URL de votre compte Twitter professionnel."
            placeholder="Ex: https://twitter.com/AliatechSolutions"
        />

        <InputWithTooltip
            label="LinkedIn"
            name="linkedin"
            value={companyInfo.socialMediaLinks.linkedin}
            onChange={(e) => setCompanyInfo({ ...companyInfo, socialMediaLinks: { ...companyInfo.socialMediaLinks, linkedin: e.target.value } })}
            tooltip="URL de votre page LinkedIn d'entreprise."
            placeholder="Ex: https://www.linkedin.com/company/aliatech-solutions"
        />

        <InputWithTooltip
            label="Instagram"
            name="instagram"
            value={companyInfo.socialMediaLinks.instagram}
            onChange={(e) => setCompanyInfo({ ...companyInfo, socialMediaLinks: { ...companyInfo.socialMediaLinks, instagram: e.target.value } })}
            tooltip="URL de votre compte Instagram professionnel."
            placeholder="Ex: https://www.instagram.com/aliatechsolutions"
        />
    </motion.div>
);

const ServicesPublicCibleStep: React.FC<{
    companyInfo: CompanyInfo;
    setCompanyInfo: React.Dispatch<React.SetStateAction<CompanyInfo>>;
}> = ({ companyInfo, setCompanyInfo }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-6"
    >
        <h2 className="text-2xl font-bold mb-6" style={{ marginTop: '4em', marginBottom: '2em', textAlign: 'center' }}>Services et Public cible</h2>
        <InfoBubble message="Détaillez vos services et votre public cible pour permettre à l'assistant de mieux comprendre votre offre et à qui elle s'adresse." />

        <ArrayInputWithTooltip
            label="Services ou produits"
            items={companyInfo.services}
            onAdd={(value) => setCompanyInfo({ ...companyInfo, services: [...companyInfo.services, value] })}
            onRemove={(index) => setCompanyInfo({ ...companyInfo, services: companyInfo.services.filter((_, i) => i !== index) })}
            tooltip="Listez les principaux services ou produits offerts par votre entreprise."
            placeholder="Ex: Développement d'applications sur mesure"
        />

        <ArrayInputWithTooltip
            label="Public cible"
            items={companyInfo.targetAudience}
            onAdd={(value) => setCompanyInfo({ ...companyInfo, targetAudience: [...companyInfo.targetAudience, value] })}
            onRemove={(index) => setCompanyInfo({ ...companyInfo, targetAudience: companyInfo.targetAudience.filter((_, i) => i !== index) })}
            tooltip="Décrivez les caractéristiques de votre clientèle idéale."
            placeholder="Ex: PME du secteur industriel"
        />

        <ArrayInputWithTooltip
            label="Concurrents principaux"
            items={companyInfo.competitors}
            onAdd={(value) => setCompanyInfo({ ...companyInfo, competitors: [...companyInfo.competitors, value] })}
            onRemove={(index) => setCompanyInfo({ ...companyInfo, competitors: companyInfo.competitors.filter((_, i) => i !== index) })}
            tooltip="Nommez vos principaux concurrents dans votre secteur d'activité."
            placeholder="Ex: TechInnovate Solutions"
        />
    </motion.div>
);

const MarqueValeursStep: React.FC<{
    companyInfo: CompanyInfo;
    setCompanyInfo: React.Dispatch<React.SetStateAction<CompanyInfo>>;
}> = ({ companyInfo, setCompanyInfo }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-6"
    >
        <h2 className="text-2xl font-bold mb-6" style={{ marginTop: '4em', marginBottom: '2em', textAlign: 'center' }}>Marque et Valeurs</h2>
        <InfoBubble message="Définissez le ton de communication et les valeurs de votre entreprise pour que l'assistant puisse les refléter dans ses interactions." />

        <TextareaWithTooltip
            label="Ton et style de communication"
            name="brandVoice"
            value={companyInfo.brandVoice}
            onChange={(e) => setCompanyInfo({ ...companyInfo, brandVoice: e.target.value })}
            tooltip="Décrivez le ton et le style de communication que votre marque adopte (ex: formel, décontracté, technique, etc.)."
            placeholder="Ex: Notre communication est professionnelle mais conviviale, avec un accent mis sur la clarté et l'accessibilité des informations techniques."
        />

        <ArrayInputWithTooltip
            label="Valeurs de l'entreprise"
            items={companyInfo.values}
            onAdd={(value) => setCompanyInfo({ ...companyInfo, values: [...companyInfo.values, value] })}
            onRemove={(index) => setCompanyInfo({ ...companyInfo, values: companyInfo.values.filter((_, i) => i !== index) })}
            tooltip="Listez les principales valeurs qui guident votre entreprise."
            placeholder="Ex: Innovation, Intégrité, Excellence"
        />
    </motion.div>
);

const FAQTemoignagesStep: React.FC<{
    companyInfo: CompanyInfo;
    setCompanyInfo: React.Dispatch<React.SetStateAction<CompanyInfo>>;
}> = ({ companyInfo, setCompanyInfo }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-6"
    >
        <h2 className="text-2xl font-bold mb-6" style={{ marginTop: '4em', marginBottom: '2em', textAlign: 'center' }}>FAQ et Témoignages</h2>
        <InfoBubble message="Les questions fréquentes et les témoignages aideront l'assistant à répondre efficacement aux requêtes courantes et à mettre en avant vos points forts." />

        <ArrayInputWithTooltip
            label="Questions fréquemment posées"
            items={companyInfo.frequentlyAskedQuestions}
            onAdd={(value) => setCompanyInfo({ ...companyInfo, frequentlyAskedQuestions: [...companyInfo.frequentlyAskedQuestions, value] })}
            onRemove={(index) => setCompanyInfo({ ...companyInfo, frequentlyAskedQuestions: companyInfo.frequentlyAskedQuestions.filter((_, i) => i !== index) })}
            tooltip="Ajoutez les questions les plus courantes posées par vos clients, avec leurs réponses."
            placeholder="Ex: Q: Quels sont vos délais de livraison ? R: Nos délais de livraison varient généralement entre 2 et 4 semaines selon la complexité du projet."
        />

        <ArrayInputWithTooltip
            label="Témoignages clients"
            items={companyInfo.testimonials}
            onAdd={(value) => setCompanyInfo({ ...companyInfo, testimonials: [...companyInfo.testimonials, value] })}
            onRemove={(index) => setCompanyInfo({ ...companyInfo, testimonials: companyInfo.testimonials.filter((_, i) => i !== index) })}
            tooltip="Ajoutez des citations ou des avis positifs de clients satisfaits."
            placeholder="Ex: 'Aliatech a transformé notre processus de gestion des données, augmentant notre productivité de 30%.' - Jean Dupont, PDG de TechCorp"
        />
    </motion.div>
);

const PolitiquesStep: React.FC<{
    companyInfo: CompanyInfo;
    setCompanyInfo: React.Dispatch<React.SetStateAction<CompanyInfo>>;
}> = ({ companyInfo, setCompanyInfo }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-6"
    >
        <h2 className="text-2xl font-bold mb-6" style={{ marginTop: '4em', marginBottom: '2em', textAlign: 'center' }}>Politiques</h2>
        <InfoBubble message="Les politiques de l'entreprise sont importantes pour informer les clients de leurs droits et de vos engagements. L'assistant pourra s'y référer pour répondre aux questions relatives à ces sujets." />

        <TextareaWithTooltip
            label="Politique de confidentialité"
            name="privacyPolicy"
            value={companyInfo.policies.privacyPolicy}
            onChange={(e) => setCompanyInfo({ ...companyInfo, policies: { ...companyInfo.policies, privacyPolicy: e.target.value } })}
            tooltip="Résumez votre politique de protection des données personnelles."
            placeholder="Ex: Nous collectons et utilisons vos données personnelles uniquement dans le cadre de nos services. Elles ne sont jamais vendues à des tiers. Vous pouvez demander l'accès, la modification ou la suppression de vos données à tout moment."
        />

        <TextareaWithTooltip
            label="Politique de retour"
            name="returnPolicy"
            value={companyInfo.policies.returnPolicy}
            onChange={(e) => setCompanyInfo({ ...companyInfo, policies: { ...companyInfo.policies, returnPolicy: e.target.value } })}
            tooltip="Décrivez les conditions de retour ou d'annulation de vos produits ou services."
            placeholder="Ex: Nous offrons une garantie de satisfaction de 30 jours sur tous nos services. Si vous n'êtes pas satisfait, nous vous rembourserons intégralement ou travaillerons avec vous pour résoudre le problème, selon votre préférence."
        />

        <TextareaWithTooltip
            label="Conditions d'utilisation"
            name="termsOfService"
            value={companyInfo.policies.termsOfService}
            onChange={(e) => setCompanyInfo({ ...companyInfo, policies: { ...companyInfo.policies, termsOfService: e.target.value } })}
            tooltip="Résumez les principales conditions d'utilisation de vos produits ou services."
            placeholder="Ex: En utilisant nos services, vous acceptez de ne pas les utiliser à des fins illégales ou non autorisées. Nous nous réservons le droit de suspendre ou de résilier votre accès en cas de violation de ces conditions."
        />
    </motion.div>
);

const EquipeLocalisationsStep: React.FC<{
    companyInfo: CompanyInfo;
    setCompanyInfo: React.Dispatch<React.SetStateAction<CompanyInfo>>;
}> = ({ companyInfo, setCompanyInfo }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-6"
    >
        <h2 className="text-2xl font-bold mb-6" style={{ marginTop: '4em', marginBottom: '2em', textAlign: 'center' }}>Équipe et Localisations</h2>
        <InfoBubble message="Les informations sur l'équipe et les emplacements aideront à personnaliser les interactions avec les clients et à fournir des détails précis sur votre présence géographique." />

        <TeamMemberInput
            members={companyInfo.team}
            onChange={(team) => setCompanyInfo({ ...companyInfo, team })}
        />

        <LocationInput
            mainOffice={companyInfo.locationDetails.mainOffice}
            branches={companyInfo.locationDetails.branches}
            onChange={(locationDetails) => setCompanyInfo({ ...companyInfo, locationDetails })}
        />
    </motion.div>
);

const InformationsSupplementairesStep: React.FC<{
    companyInfo: CompanyInfo;
    setCompanyInfo: React.Dispatch<React.SetStateAction<CompanyInfo>>;
}> = ({ companyInfo, setCompanyInfo }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-6"
    >
        <h2 className="text-2xl font-bold mb-6" style={{ marginTop: '4em', marginBottom: '2em', textAlign: 'center' }}>Informations supplémentaires</h2>
        <InfoBubble message="Ces informations complémentaires enrichiront la connaissance de l'assistant sur votre entreprise, lui permettant de fournir des réponses plus détaillées et contextuelles." />

        <TextareaWithTooltip
            label="Historique de l'entreprise"
            name="companyHistory"
            value={companyInfo.otherInfo?.companyHistory || ''}
            onChange={(e) => setCompanyInfo({ ...companyInfo, otherInfo: { ...companyInfo.otherInfo, companyHistory: e.target.value } })}
            tooltip="Décrivez brièvement l'histoire de votre entreprise, ses origines et son évolution."
            placeholder="Ex: Fondée en 2010 par deux ingénieurs passionnés d'IA, Aliatech a connu une croissance rapide, devenant un leader dans le domaine des solutions d'IA pour entreprises en seulement une décennie."
        />

        <TextareaWithTooltip
            label="Culture d'entreprise"
            name="companyCulture"
            value={companyInfo.otherInfo?.companyCulture || ''}
            onChange={(e) => setCompanyInfo({ ...companyInfo, otherInfo: { ...companyInfo.otherInfo, companyCulture: e.target.value } })}
            tooltip="Décrivez la culture et l'ambiance au sein de votre entreprise."
            placeholder="Ex: Chez Aliatech, nous cultivons un environnement de travail collaboratif et innovant. Nous encourageons la créativité, l'apprentissage continu et l'équilibre vie professionnelle-vie personnelle."
        />

        <ArrayInputWithTooltip
            label="Certifications et récompenses"
            items={companyInfo.otherInfo?.certificationsAwards || []}
            onAdd={(value) => setCompanyInfo({ ...companyInfo, otherInfo: { ...companyInfo.otherInfo, certificationsAwards: [...(companyInfo.otherInfo?.certificationsAwards || []), value] } })}
            onRemove={(index) => setCompanyInfo({ ...companyInfo, otherInfo: { ...companyInfo.otherInfo, certificationsAwards: (companyInfo.otherInfo?.certificationsAwards || []).filter((_, i) => i !== index) } })}
            tooltip="Listez les certifications, prix ou reconnaissances obtenues par votre entreprise."
            placeholder="Ex: Prix de l'Innovation Technologique 2023 - Chambre de Commerce"
        />

        <ArrayInputWithTooltip
            label="Projets futurs"
            items={companyInfo.otherInfo?.futureProjects || []}
            onAdd={(value) => setCompanyInfo({ ...companyInfo, otherInfo: { ...companyInfo.otherInfo, futureProjects: [...(companyInfo.otherInfo?.futureProjects || []), value] } })}
            onRemove={(index) => setCompanyInfo({ ...companyInfo, otherInfo: { ...companyInfo.otherInfo, futureProjects: (companyInfo.otherInfo?.futureProjects || []).filter((_, i) => i !== index) } })}
            tooltip="Mentionnez les projets ou objectifs futurs de l'entreprise que vous souhaitez partager."
            placeholder="Ex: Lancement d'une nouvelle plateforme d'IA prédictive pour le secteur de la santé prévu pour le T3 2024"
        />

        <TextareaWithTooltip
            label="Informations supplémentaires"
            name="additionalInfo"
            value={companyInfo.otherInfo?.additionalInfo || ''}
            onChange={(e) => setCompanyInfo({ ...companyInfo, otherInfo: { ...companyInfo.otherInfo, additionalInfo: e.target.value } })}
            tooltip="Ajoutez toute autre information pertinente que vous souhaitez inclure."
            placeholder="Ex: Aliatech est engagée dans diverses initiatives de responsabilité sociale d'entreprise, notamment un programme de mentorat pour les jeunes talents en technologie et un engagement à atteindre la neutralité carbone d'ici 2025."
        />
    </motion.div>
);

// Composants utilitaires
const InfoBubble: React.FC<{ message: string }> = ({ message }) => (
    <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded-md shadow-sm">
        <p className="font-semibold mb-1">Conseil</p>
        <p>{message}</p>
    </div>
);

const InputWithTooltip: React.FC<{
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    tooltip: string;
    placeholder?: string;
}> = ({ label, name, value, onChange, tooltip, placeholder }) => (
    <div className="relative">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            {label}
            <Tooltip content={tooltip}>
                <Icons.HelpCircle />
            </Tooltip>
        </label>
        <Input
            type="text"
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
    </div>
);

const TextareaWithTooltip: React.FC<{
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    tooltip: string;
    placeholder?: string;
}> = ({ label, name, value, onChange, tooltip, placeholder }) => (
    <div className="relative">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            {label}
            <Tooltip content={tooltip}>
                <Icons.HelpCircle />
            </Tooltip>
        </label>
        <Textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
    </div>
);

const ArrayInputWithTooltip: React.FC<{
    label: string;
    items: string[];
    onAdd: (value: string) => void;
    onRemove: (index: number) => void;
    tooltip: string;
    placeholder?: string;
}> = ({ label, items, onAdd, onRemove, tooltip, placeholder }) => {
    const [inputValue, setInputValue] = useState('');

    const handleAdd = () => {
        if (inputValue.trim()) {
            onAdd(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <Tooltip content={tooltip}>
                    <Icons.HelpCircle />
                </Tooltip>
            </div>
            <AnimatePresence>
                {items.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center mb-2"
                    >
                        <Input value={item} readOnly className="flex-grow" />
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onRemove(index)}
                            className="ml-2 p-2 text-red-500 hover:text-red-700"
                        >
                            <Icons.Trash2 />
                        </motion.button>
                    </motion.div>
                ))}
            </AnimatePresence>
            <motion.div
                className="flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={placeholder}
                    className="flex-grow"
                    onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                />
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleAdd}
                    className="ml-2 p-2 text-green-500 hover:text-green-700"
                >
                    <Icons.Plus />
                </motion.button>
            </motion.div>
        </div>
    );
};

const TeamMemberInput: React.FC<{
    members: Array<{ name: string; position: string; bio: string }>;
    onChange: (members: Array<{ name: string; position: string; bio: string }>) => void;
}> = ({ members, onChange }) => {
    const addMember = () => {
        onChange([...members, { name: '', position: '', bio: '' }]);
    };

    const updateMember = (index: number, field: string, value: string) => {
        const updatedMembers = members.map((member, i) =>
            i === index ? { ...member, [field]: value } : member
        );
        onChange(updatedMembers);
    };

    const removeMember = (index: number) => {
        onChange(members.filter((_, i) => i !== index));
    };

    return (
        <div>
            <h3 className="text-xl font-semibold mb-4">Équipe</h3>
            {members.map((member, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-4 border rounded-md"
                >
                    <InputWithTooltip
                        label="Nom"
                        name={`member-name-${index}`}
                        value={member.name}
                        onChange={(e) => updateMember(index, 'name', e.target.value)}
                        tooltip="Nom complet du membre de l'équipe"
                        placeholder="Ex: Marie Dupont"
                    />
                    <InputWithTooltip
                        label="Poste"
                        name={`member-position-${index}`}
                        value={member.position}
                        onChange={(e) => updateMember(index, 'position', e.target.value)}
                        tooltip="Titre ou fonction du membre dans l'entreprise"
                        placeholder="Ex: Directrice Technique"
                    />
                    <TextareaWithTooltip
                        label="Biographie"
                        name={`member-bio-${index}`}
                        value={member.bio}
                        onChange={(e) => updateMember(index, 'bio', e.target.value)}
                        tooltip="Brève description du parcours et des responsabilités du membre"
                        placeholder="Ex: Marie a plus de 15 ans d'expérience dans le développement de solutions IA. Elle dirige notre équipe technique et supervise tous les projets de R&D."
                    />
                    <motion.button
                        onClick={() => removeMember(index)}
                        className="mt-2 text-red-500 hover:text-red-700"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Supprimer ce membre
                    </motion.button>
                </motion.div>
            ))}
            <motion.button
                onClick={addMember}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Ajouter un membre
            </motion.button>
        </div>
    );
};

const LocationInput: React.FC<{
    mainOffice: { address: string; hours: string[] };
    branches: Array<{ address: string; hours: string[] }>;
    onChange: (locationDetails: { mainOffice: { address: string; hours: string[] }; branches: Array<{ address: string; hours: string[] }> }) => void;
}> = ({ mainOffice, branches, onChange }) => {
    const updateMainOffice = (field: string, value: string | string[]) => {
        onChange({ mainOffice: { ...mainOffice, [field]: value }, branches });
    };

    const updateBranch = (index: number, field: string, value: string | string[]) => {
        const updatedBranches = branches.map((branch, i) =>
            i === index ? { ...branch, [field]: value } : branch
        );
        onChange({ mainOffice, branches: updatedBranches });
    };

    const addBranch = () => {
        onChange({ mainOffice, branches: [...branches, { address: '', hours: [] }] });
    };

    const removeBranch = (index: number) => {
        onChange({ mainOffice, branches: branches.filter((_, i) => i !== index) });
    };

    return (
        <div>
            <h3 className="text-xl font-semibold mb-4">Localisations</h3>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 border rounded-md"
            >
                <h4 className="text-lg font-medium mb-2">Siège social</h4>
                <InputWithTooltip
                    label="Adresse"
                    name="main-office-address"
                    value={mainOffice.address}
                    onChange={(e) => updateMainOffice('address', e.target.value)}
                    tooltip="Adresse complète du siège social"
                    placeholder="Ex: 123 Rue de l'Innovation, 75001 Paris, France"
                />
                <ArrayInputWithTooltip
                    label="Heures d'ouverture"
                    items={mainOffice.hours}
                    onAdd={(value) => updateMainOffice('hours', [...mainOffice.hours, value])}
                    onRemove={(index) => updateMainOffice('hours', mainOffice.hours.filter((_, i) => i !== index))}
                    tooltip="Heures d'ouverture du siège social"
                    placeholder="Ex: Lundi-Vendredi: 9h-18h"
                />
            </motion.div>
            {branches.map((branch, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-4 border rounded-md"
                >
                    <h4 className="text-lg font-medium mb-2">Bureau {index + 1}</h4>
                    <InputWithTooltip
                        label="Adresse"
                        name={`branch-address-${index}`}
                        value={branch.address}
                        onChange={(e) => updateBranch(index, 'address', e.target.value)}
                        tooltip="Adresse complète du bureau"
                        placeholder="Ex: 456 Avenue de la Tech, 69001 Lyon, France"
                    />
                    <ArrayInputWithTooltip
                        label="Heures d'ouverture"
                        items={branch.hours}
                        onAdd={(value) => updateBranch(index, 'hours', [...branch.hours, value])}
                        onRemove={(hourIndex) => updateBranch(index, 'hours', branch.hours.filter((_, i) => i !== hourIndex))}
                        tooltip="Heures d'ouverture du bureau"
                        placeholder="Ex: Lundi-Vendredi: 9h-17h"
                    />
                    <motion.button
                        onClick={() => removeBranch(index)}
                        className="mt-2 text-red-500 hover:text-red-700"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Supprimer ce bureau
                    </motion.button>
                </motion.div>
            ))}
            <motion.button
                onClick={addBranch}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Ajouter un bureau
            </motion.button>
        </div>
    );
};

export default CompanyInfoForm;