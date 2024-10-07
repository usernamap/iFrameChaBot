import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChatbotConfig, CompanyInfo } from '@/types';
import { Icons } from '@/components/common/Icons';
import { InputWithLabel } from '@/components/ui/InputWithLabel';
import ColorPicker from '@/components/customize/ColorPicker';
import FontSelector from '@/components/customize/FontSelector';
import Link from 'next/link';

interface RecapComponentProps {
    chatbotConfig: ChatbotConfig;
    companyInfo: CompanyInfo;
    onConfigChange: (newConfig: ChatbotConfig) => void;
    onCompanyInfoChange: (newInfo: CompanyInfo) => void;
}

const RecapComponent: React.FC<RecapComponentProps> = ({
    chatbotConfig,
    companyInfo,
    onConfigChange,
    onCompanyInfoChange,
}) => {
    const [editingSection, setEditingSection] = useState<string | null>(null);

    const handleEdit = (section: string) => {
        setEditingSection(section);
    };

    const handleSave = () => {
        setEditingSection(null);
    };

    const updateConfig = (key: keyof ChatbotConfig, value: any) => {
        onConfigChange({ ...chatbotConfig, [key]: value });
    };

    const updateCompanyInfo = (key: keyof CompanyInfo, value: any) => {
        onCompanyInfoChange({ ...companyInfo, [key]: value });
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Récapitulatif de votre chatbot</h2>

            <Section
                title="Apparence"
                isEditing={editingSection === 'appearance'}
                onEdit={() => handleEdit('appearance')}
                onSave={handleSave}
            >
                {editingSection === 'appearance' ? (
                    <div className="space-y-4">
                        <ColorPicker
                            label="Couleur principale"
                            color={chatbotConfig.primaryColor}
                            onChange={(color) => updateConfig('primaryColor', color)}
                            tooltip="Choisissez la couleur principale de votre chatbot"
                            onTooltip={() => { }}
                        />
                        <FontSelector
                            font={chatbotConfig.fontFamily}
                            onChange={(font) => updateConfig('fontFamily', font)}
                            tooltip="Sélectionnez la police de caractères pour votre chatbot"
                            onTooltip={() => { }}
                        />
                        <InputWithLabel
                            label="Taille de la police"
                            id="fontSize"
                            value={chatbotConfig.fontSize}
                            onChange={(e) => updateConfig('fontSize', e.target.value)}
                            onTooltip={() => { }}
                        />
                    </div>
                ) : (
                    <div>
                        <p>Couleur principale : {chatbotConfig.primaryColor}</p>
                        <p>Police : {chatbotConfig.fontFamily}</p>
                        <p>Taille de la police : {chatbotConfig.fontSize}</p>
                    </div>
                )}
            </Section>

            <Section
                title="Messages"
                isEditing={editingSection === 'messages'}
                onEdit={() => handleEdit('messages')}
                onSave={handleSave}
            >
                {editingSection === 'messages' ? (
                    <div className="space-y-4">
                        <InputWithLabel
                            label="Message de bienvenue"
                            id="welcomeMessage"
                            value={chatbotConfig.welcomeMessage}
                            onChange={(e) => updateConfig('welcomeMessage', e.target.value)}
                            onTooltip={() => { }}
                        />
                        <InputWithLabel
                            label="Titre de l'en-tête"
                            id="headerTitle"
                            value={chatbotConfig.headerTitle}
                            onChange={(e) => updateConfig('headerTitle', e.target.value)}
                            onTooltip={() => { }}
                        />
                    </div>
                ) : (
                    <div>
                        <p>Message de bienvenue : {chatbotConfig.welcomeMessage}</p>
                        <p>Titre de l'en-tête : {chatbotConfig.headerTitle}</p>
                    </div>
                )}
            </Section>

            <Section
                title="Informations de l'entreprise"
                isEditing={editingSection === 'companyInfo'}
                onEdit={() => handleEdit('companyInfo')}
                onSave={handleSave}
            >
                {editingSection === 'companyInfo' ? (
                    <div className="space-y-4">
                        <InputWithLabel
                            label="Nom de l'entreprise"
                            id="companyName"
                            value={companyInfo.name}
                            onChange={(e) => updateCompanyInfo('name', e.target.value)}
                            onTooltip={() => { }}
                        />
                        <InputWithLabel
                            label="Secteur d'activité"
                            id="industry"
                            value={companyInfo.industry}
                            onChange={(e) => updateCompanyInfo('industry', e.target.value)}
                            onTooltip={() => { }}
                        />
                    </div>
                ) : (
                    <div>
                        <p>Nom : {companyInfo.name}</p>
                        <p>Secteur : {companyInfo.industry}</p>
                    </div>
                )}
            </Section>

            <div className="mt-6 flex justify-between">
                <Link href="/company-info" passHref>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-300 transition-colors flex items-center"
                    >
                        <Icons.ArrowLeft />
                        ‎ ‎  ‎  Retour au formulaire
                    </motion.button>
                </Link>
                <Link href="/customize" passHref>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark transition-colors flex items-center p-5"
                    >
                        Personnaliser davantage   ‎ ‎  ‎
                        <Icons.Settings />
                    </motion.button>
                </Link>
            </div>
        </div>
    );
};

const Section: React.FC<{
    title: string;
    isEditing: boolean;
    onEdit: () => void;
    onSave: () => void;
    children: React.ReactNode;
}> = ({ title, isEditing, onEdit, onSave, children }) => (
    <div className="mb-6 p-4 border rounded-lg">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{title}</h3>
            {isEditing ? (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onSave}
                    className="text-green-500 hover:text-green-700"
                >
                    <Icons.Check />
                </motion.button>
            ) : (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onEdit}
                    className="text-blue-500 hover:text-blue-700"
                >
                    <Icons.Edit />
                </motion.button>
            )}
        </div>
        {children}
    </div>
);

export default RecapComponent;