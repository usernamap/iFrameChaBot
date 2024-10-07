import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Icons } from '@/components/common/Icons';
import { Tooltip } from '@/components/ui/Tooltip';
import { CompanyInfo } from '@/types';
import usePersistedState from '@/contexts/usePersistedState';


interface CompanyInfoFormProps {
    onNextStep: (companyInfo: CompanyInfo) => void;
}

const CompanyInfoForm: React.FC<CompanyInfoFormProps> = ({ onNextStep }) => {
    const [step, setStep] = usePersistedState('companyInfoStep', 1);
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
        }
    });


    useEffect(() => {
        setIsHydrated(true); // Indique que le composant est hydraté
    }, []);

    if (!isHydrated) {
        return null; // Ne pas rendre le contenu tant que l'hydratation n'est pas complète
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: keyof CompanyInfo,
        nestedField?: string
    ) => {
        const { value } = e.target;
        setCompanyInfo(prevInfo => {
            if (nestedField) {
                const updatedField = prevInfo[field] as Record<string, any>;
                return {
                    ...prevInfo,
                    [field]: {
                        ...updatedField,
                        [nestedField]: value
                    }
                };
            }
            return { ...prevInfo, [field]: value };
        });
    };

    const handleArrayChange = (field: keyof CompanyInfo, value: string) => {
        setCompanyInfo(prevInfo => {
            const currentValue = prevInfo[field];
            if (Array.isArray(currentValue)) {
                return { ...prevInfo, [field]: [...currentValue, value] };
            }
            return prevInfo;
        });
    };

    const handleRemoveArrayItem = (field: keyof CompanyInfo, index: number) => {
        setCompanyInfo(prevInfo => {
            const currentValue = prevInfo[field];
            if (Array.isArray(currentValue)) {
                return { ...prevInfo, [field]: currentValue.filter((_, i) => i !== index) };
            }
            return prevInfo;
        });
    };

    const handleNextStep = () => {
        if (step < 8) {
            setStep(step + 1);
        } else {
            onNextStep(companyInfo);
        }
    };

    const handlePrevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <BasicInfoStep
                        companyInfo={companyInfo}
                        handleChange={handleChange}
                    />
                );
            case 2:
                return (
                    <ContactAndSocialStep
                        companyInfo={companyInfo}
                        handleChange={handleChange}
                    />
                );
            case 3:
                return (
                    <ServicesAndAudienceStep
                        companyInfo={companyInfo}
                        handleArrayChange={handleArrayChange}
                        handleRemoveArrayItem={handleRemoveArrayItem}
                    />
                );
            case 4:
                return (
                    <BrandAndValuesStep
                        companyInfo={companyInfo}
                        handleChange={handleChange}
                        handleArrayChange={handleArrayChange}
                        handleRemoveArrayItem={handleRemoveArrayItem}
                    />
                );
            case 5:
                return (
                    <FAQAndTestimonialsStep
                        companyInfo={companyInfo}
                        handleArrayChange={handleArrayChange}
                        handleRemoveArrayItem={handleRemoveArrayItem}
                    />
                );
            case 6:
                return (
                    <PoliciesStep
                        companyInfo={companyInfo}
                        handleChange={handleChange}
                    />
                );
            case 7:
                return (
                    <TeamAndLocationsStep
                        companyInfo={companyInfo}
                        setCompanyInfo={setCompanyInfo}
                    />
                );
            case 8:
                return (
                    <OtherInfoStep
                        companyInfo={companyInfo}
                        setCompanyInfo={setCompanyInfo}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
                {renderStep()}
            </AnimatePresence>
            <div className="mt-8 flex justify-between">
                {step > 1 && (
                    <motion.button
                        onClick={handlePrevStep}
                        className="bg-gray-300 text-gray-700 px-4 py-4 rounded-full hover:bg-gray-400 transition-colors flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Icons.ArrowLeft />

                        <div className='ml-2'>Précédent</div>
                    </motion.button>
                )}
                <motion.button
                    onClick={handleNextStep}
                    className="bg-primary text-white px-4 py-4 rounded-full hover:bg-primary-dark transition-colors flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <div className='mr-2'>
                        {step === 8 ? 'Terminer' : 'Suivant'}
                    </div>
                    <Icons.ArrowRight />
                </motion.button>
            </div>
        </div>
    );
};

// Composants pour chaque étape
const BasicInfoStep: React.FC<{
    companyInfo: CompanyInfo;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof CompanyInfo) => void;
}> = ({ companyInfo, handleChange }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-4"
    >
        <h2 className="text-2xl font-bold mb-4">Informations de base</h2>
        <InfoBubble message="Plus vous fournissez d'informations, plus l'assistant sera précis et cohérent. Cependant, tous les champs ne sont pas obligatoires." />
        <InputWithTooltip
            label="Nom de l'entreprise"
            name="name"
            value={companyInfo.name}
            onChange={(e) => handleChange(e, 'name')}
            tooltip="Le nom officiel de votre entreprise"
        />
        <InputWithTooltip
            label="Secteur d'activité"
            name="industry"
            value={companyInfo.industry}
            onChange={(e) => handleChange(e, 'industry')}
            tooltip="Le domaine principal dans lequel votre entreprise opère"
        />
        <TextareaWithTooltip
            label="Description de l'entreprise"
            name="description"
            value={companyInfo.description}
            onChange={(e) => handleChange(e, 'description')}
            tooltip="Une brève description de ce que fait votre entreprise"
        />
        <InputWithTooltip
            label="Localisation"
            name="location"
            value={companyInfo.location}
            onChange={(e) => handleChange(e, 'location')}
            tooltip="L'emplacement principal de votre entreprise"
        />
        <InputWithTooltip
            label="Site web"
            name="website"
            value={companyInfo.website}
            onChange={(e) => handleChange(e, 'website')}
            tooltip="L'URL du site web officiel de votre entreprise"
        />
    </motion.div>
);

const ContactAndSocialStep: React.FC<{
    companyInfo: CompanyInfo;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>, field: keyof CompanyInfo, nestedField?: string) => void;
}> = ({ companyInfo, handleChange }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-4"
    >
        <h2 className="text-2xl font-bold mb-4">Contact et réseaux sociaux</h2>
        <InfoBubble message="Les informations de contact et les liens vers les réseaux sociaux aideront l'assistant à fournir des informations précises aux clients." />
        <InputWithTooltip
            label="Téléphone"
            name="phone"
            value={companyInfo.contact.phone}
            onChange={(e) => handleChange(e, 'contact', 'phone')}
            tooltip="Le numéro de téléphone principal de votre entreprise"
        />
        <InputWithTooltip
            label="Email"
            name="email"
            value={companyInfo.contact.email}
            onChange={(e) => handleChange(e, 'contact', 'email')}
            tooltip="L'adresse email principale pour les contacts professionnels"
        />
        <InputWithTooltip
            label="Facebook"
            name="facebook"
            value={companyInfo.socialMediaLinks.facebook}
            onChange={(e) => handleChange(e, 'socialMediaLinks', 'facebook')}
            tooltip="Le lien vers la page Facebook de votre entreprise"
        />
        <InputWithTooltip
            label="Twitter"
            name="twitter"
            value={companyInfo.socialMediaLinks.twitter}
            onChange={(e) => handleChange(e, 'socialMediaLinks', 'twitter')}
            tooltip="Le lien vers le compte Twitter de votre entreprise"
        />
        <InputWithTooltip
            label="LinkedIn"
            name="linkedin"
            value={companyInfo.socialMediaLinks.linkedin}
            onChange={(e) => handleChange(e, 'socialMediaLinks', 'linkedin')}
            tooltip="Le lien vers la page LinkedIn de votre entreprise"
        />
        <InputWithTooltip
            label="Instagram"
            name="instagram"
            value={companyInfo.socialMediaLinks.instagram}
            onChange={(e) => handleChange(e, 'socialMediaLinks', 'instagram')}
            tooltip="Le lien vers le compte Instagram de votre entreprise"
        />
    </motion.div>
);

const ServicesAndAudienceStep: React.FC<{
    companyInfo: CompanyInfo;
    handleArrayChange: (field: keyof CompanyInfo, value: string) => void;
    handleRemoveArrayItem: (field: keyof CompanyInfo, index: number) => void;
}> = ({ companyInfo, handleArrayChange, handleRemoveArrayItem }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-4"
    >
        <h2 className="text-2xl font-bold mb-4">Services et public cible</h2>
        <InfoBubble message="Détailler vos services et votre public cible aidera l'assistant à mieux comprendre votre offre et à qui elle s'adresse." />
        <ArrayInputWithTooltip
            label="Services ou produits"
            items={companyInfo.services}
            onAdd={(value) => handleArrayChange('services', value)}
            onRemove={(index) => handleRemoveArrayItem('services', index)}
            tooltip="Liste des principaux services ou produits offerts par votre entreprise"
        />
        <ArrayInputWithTooltip
            label="Public cible"
            items={companyInfo.targetAudience}
            onAdd={(value) => handleArrayChange('targetAudience', value)}
            onRemove={(index) => handleRemoveArrayItem('targetAudience', index)}
            tooltip="Caractéristiques de votre clientèle idéale"
        />
        <ArrayInputWithTooltip
            label="Concurrents principaux"
            items={companyInfo.competitors}
            onAdd={(value) => handleArrayChange('competitors', value)}
            onRemove={(index) => handleRemoveArrayItem('competitors', index)}
            tooltip="Noms des principaux concurrents dans votre secteur"
        />
    </motion.div>
);

const BrandAndValuesStep: React.FC<{
    companyInfo: CompanyInfo;
    handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>, field: keyof CompanyInfo) => void;
    handleArrayChange: (field: keyof CompanyInfo, value: string) => void;
    handleRemoveArrayItem: (field: keyof CompanyInfo, index: number) => void;
}> = ({ companyInfo, handleChange, handleArrayChange, handleRemoveArrayItem }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-4"
    >
        <h2 className="text-2xl font-bold mb-4">Marque et valeurs</h2>
        <InfoBubble message="Définir votre ton de communication et vos valeurs aidera l'assistant à communiquer de manière cohérente avec votre image de marque." />
        <TextareaWithTooltip
            label="Ton et style de communication"
            name="brandVoice"
            value={companyInfo.brandVoice}
            onChange={(e) => handleChange(e, 'brandVoice')}
            tooltip="Décrivez le ton et le style de communication de votre marque (ex: formel, décontracté, humoristique)"
        />
        <ArrayInputWithTooltip
            label="Valeurs de l'entreprise"
            items={companyInfo.values}
            onAdd={(value) => handleArrayChange('values', value)}
            onRemove={(index) => handleRemoveArrayItem('values', index)}
            tooltip="Les principes fondamentaux qui guident votre entreprise"
        />
    </motion.div>
);

const FAQAndTestimonialsStep: React.FC<{
    companyInfo: CompanyInfo;
    handleArrayChange: (field: keyof CompanyInfo, value: string) => void;
    handleRemoveArrayItem: (field: keyof CompanyInfo, index: number) => void;
}> = ({ companyInfo, handleArrayChange, handleRemoveArrayItem }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-4"
    >
        <h2 className="text-2xl font-bold mb-4">FAQ et témoignages</h2>
        <InfoBubble message="Les questions fréquentes et les témoignages aideront l'assistant à mieux répondre aux requêtes des clients et à mettre en avant vos points forts." />
        <ArrayInputWithTooltip
            label="Questions fréquemment posées"
            items={companyInfo.frequentlyAskedQuestions}
            onAdd={(value) => handleArrayChange('frequentlyAskedQuestions', value)}
            onRemove={(index) => handleRemoveArrayItem('frequentlyAskedQuestions', index)}
            tooltip="Les questions les plus courantes posées par vos clients, avec leurs réponses"
        />
        <ArrayInputWithTooltip
            label="Témoignages clients"
            items={companyInfo.testimonials}
            onAdd={(value) => handleArrayChange('testimonials', value)}
            onRemove={(index) => handleRemoveArrayItem('testimonials', index)}
            tooltip="Citations ou avis positifs de clients satisfaits"
        />
    </motion.div>
);

const PoliciesStep: React.FC<{
    companyInfo: CompanyInfo;
    handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>, field: keyof CompanyInfo, nestedField?: string) => void;
}> = ({ companyInfo, handleChange }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-4"
    >
        <h2 className="text-2xl font-bold mb-4">Politiques</h2>
        <InfoBubble message="Les politiques de l'entreprise sont importantes pour informer les clients de leurs droits et de vos engagements." />
        <TextareaWithTooltip
            label="Politique de confidentialité"
            name="privacyPolicy"
            value={companyInfo.policies.privacyPolicy}
            onChange={(e) => handleChange(e, 'policies', 'privacyPolicy')}
            tooltip="Résumé de votre politique de protection des données personnelles"
        />
        <TextareaWithTooltip
            label="Politique de retour"
            name="returnPolicy"
            value={companyInfo.policies.returnPolicy}
            onChange={(e) => handleChange(e, 'policies', 'returnPolicy')}
            tooltip="Conditions de retour ou d'annulation de vos produits ou services"
        />
        <TextareaWithTooltip
            label="Conditions d'utilisation"
            name="termsOfService"
            value={companyInfo.policies.termsOfService}
            onChange={(e) => handleChange(e, 'policies', 'termsOfService')}
            tooltip="Résumé des conditions d'utilisation de vos produits ou services"
        />
    </motion.div>
);

const TeamAndLocationsStep: React.FC<{
    companyInfo: CompanyInfo;
    setCompanyInfo: React.Dispatch<React.SetStateAction<CompanyInfo>>;
}> = ({ companyInfo, setCompanyInfo }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-4"
    >
        <h2 className="text-2xl font-bold mb-4">Équipe et emplacements</h2>
        <InfoBubble message="Les informations sur l'équipe et les emplacements aideront à personnaliser les interactions avec les clients." />
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

const OtherInfoStep: React.FC<{
    companyInfo: CompanyInfo;
    setCompanyInfo: React.Dispatch<React.SetStateAction<CompanyInfo>>;
}> = ({ companyInfo, setCompanyInfo }) => {
    const handleChange1 = (e: React.ChangeEvent<HTMLTextAreaElement>, field: keyof CompanyInfo['otherInfo']) => {
        setCompanyInfo(prevInfo => ({
            ...prevInfo,
            otherInfo: {
                ...prevInfo.otherInfo,
                [field]: e.target.value
            }
        }));
    };

    const handleArrayChange = (field: keyof CompanyInfo['otherInfo'], value: string) => {
        setCompanyInfo(prevInfo => ({
            ...prevInfo,
            otherInfo: {
                ...prevInfo.otherInfo,
                [field]: [...(prevInfo.otherInfo?.[field] as string[] || []), value]
            }
        }));
    };

    const handleRemoveArrayItem = (field: keyof CompanyInfo['otherInfo'], index: number) => {
        setCompanyInfo(prevInfo => ({
            ...prevInfo,
            otherInfo: {
                ...prevInfo.otherInfo,
                [field]: (prevInfo.otherInfo?.[field] as string[] || []).filter((_, i) => i !== index)
            }
        }));
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
        >
            <h2 className="text-2xl font-bold mb-4">Informations supplémentaires</h2>
            <InfoBubble message="Ajoutez ici toute information supplémentaire qui pourrait être utile pour votre assistant virtuel." />

            <TextareaWithTooltip
                label="Historique de l'entreprise"
                name="companyHistory"
                value={companyInfo.otherInfo?.companyHistory || ''}
                onChange={(e) => handleChange1(e, 'companyHistory')}
                tooltip="Brève histoire de votre entreprise, ses origines et son évolution"
            />

            <TextareaWithTooltip
                label="Culture d'entreprise"
                name="companyCulture"
                value={companyInfo.otherInfo?.companyCulture || ''}
                onChange={(e) => handleChange1(e, 'companyCulture')}
                tooltip="Description de la culture et de l'ambiance au sein de votre entreprise"
            />

            <ArrayInputWithTooltip
                label="Certifications et récompenses"
                items={companyInfo.otherInfo?.certificationsAwards || []}
                onAdd={(value) => handleArrayChange('certificationsAwards', value)}
                onRemove={(index) => handleRemoveArrayItem('certificationsAwards', index)}
                tooltip="Liste des certifications, prix ou reconnaissances obtenues par votre entreprise"
            />

            <ArrayInputWithTooltip
                label="Projets futurs"
                items={companyInfo.otherInfo?.futureProjects || []}
                onAdd={(value) => handleArrayChange('futureProjects', value)}
                onRemove={(index) => handleRemoveArrayItem('futureProjects', index)}
                tooltip="Projets ou objectifs futurs de l'entreprise que vous souhaitez partager"
            />

            <TextareaWithTooltip
                label="Informations supplémentaires"
                name="additionalInfo"
                value={companyInfo.otherInfo?.additionalInfo || ''}
                onChange={(e) => handleChange1(e, 'additionalInfo')}
                tooltip="Toute autre information pertinente que vous souhaitez ajouter"
            />
        </motion.div>
    );
};

// Composants utilitaires
const InfoBubble: React.FC<{ message: string }> = ({ message }) => (
    <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4 rounded">
        <p className="font-bold">Info</p>
        <p>{message}</p>
    </div>
);

const InputWithTooltip: React.FC<{
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    tooltip: string;
}> = ({ label, name, value, onChange, tooltip }) => (
    <div className="relative">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
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
}> = ({ label, name, value, onChange, tooltip }) => (
    <div className="relative">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
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
}> = ({ label, items, onAdd, onRemove, tooltip }) => {
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
                        className="flex items-center"
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
                    placeholder={`Ajouter ${label.toLowerCase()}`}
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
                    />
                    <InputWithTooltip
                        label="Poste"
                        name={`member-position-${index}`}
                        value={member.position}
                        onChange={(e) => updateMember(index, 'position', e.target.value)}
                        tooltip="Titre ou fonction du membre dans l'entreprise"
                    />
                    <TextareaWithTooltip
                        label="Biographie"
                        name={`member-bio-${index}`}
                        value={member.bio}
                        onChange={(e) => updateMember(index, 'bio', e.target.value)}
                        tooltip="Brève description du parcours et des responsabilités du membre"
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
            <h3 className="text-xl font-semibold mb-4">Emplacements</h3>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 border rounded-md"
            >
                <h4 className="text-lg font-medium mb-2">Bureau principal</h4>
                <InputWithTooltip
                    label="Adresse"
                    name="main-office-address"
                    value={mainOffice.address}
                    onChange={(e) => updateMainOffice('address', e.target.value)}
                    tooltip="Adresse complète du bureau principal"
                />
                <ArrayInputWithTooltip
                    label="Heures d'ouverture"
                    items={mainOffice.hours}
                    onAdd={(value) => updateMainOffice('hours', [...mainOffice.hours, value])}
                    onRemove={(index) => updateMainOffice('hours', mainOffice.hours.filter((_, i) => i !== index))}
                    tooltip="Heures d'ouverture du bureau principal (ex: Lundi-Vendredi: 9h-18h)"
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
                    <h4 className="text-lg font-medium mb-2">Filiale {index + 1}</h4>
                    <InputWithTooltip
                        label="Adresse"
                        name={`branch-address-${index}`}
                        value={branch.address}
                        onChange={(e) => updateBranch(index, 'address', e.target.value)}
                        tooltip="Adresse complète de la filiale"
                    />
                    <ArrayInputWithTooltip
                        label="Heures d'ouverture"
                        items={branch.hours}
                        onAdd={(value) => updateBranch(index, 'hours', [...branch.hours, value])}
                        onRemove={(hourIndex) => updateBranch(index, 'hours', branch.hours.filter((_, i) => i !== hourIndex))}
                        tooltip="Heures d'ouverture de la filiale (ex: Lundi-Vendredi: 9h-18h)"
                    />
                    <motion.button
                        onClick={() => removeBranch(index)}
                        className="mt-2 text-red-500 hover:text-red-700"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Supprimer cette filiale
                    </motion.button>
                </motion.div>
            ))}
            <motion.button
                onClick={addBranch}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Ajouter une filiale
            </motion.button>
        </div>
    );
};

export default CompanyInfoForm;