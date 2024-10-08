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
        <div className="bg-white shadow-xl rounded-2xl p-8 mb-12">
            <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
                Récapitulatif de votre Chatbot
            </h2>

            {/* Sections d'information */}
            <div className="space-y-8">
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
                        <div className="text-gray-700">
                            <p>
                                <span className="font-semibold">Couleur principale :</span> {chatbotConfig.primaryColor}
                            </p>
                            <p>
                                <span className="font-semibold">Police :</span> {chatbotConfig.fontFamily}
                            </p>
                            <p>
                                <span className="font-semibold">Taille de la police :</span> {chatbotConfig.fontSize}
                            </p>
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
                        <div className="text-gray-700">
                            <p>
                                <span className="font-semibold">Message de bienvenue :</span> {chatbotConfig.welcomeMessage}
                            </p>
                            <p>
                                <span className="font-semibold">Titre de l'en-tête :</span> {chatbotConfig.headerTitle}
                            </p>
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
                        <div className="text-gray-700">
                            <p>
                                <span className="font-semibold">Nom :</span> {companyInfo.name}
                            </p>
                            <p>
                                <span className="font-semibold">Secteur :</span> {companyInfo.industry}
                            </p>
                        </div>
                    )}
                </Section>
            </div>

            {/* Section des actions principales */}
            <div className="mt-12 space-y-6">
                {/* Bouton "Payer" ultra visible */}
                <div className="">
                    <Link href="/payment" passHref>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full text-center justify-center flex items-center bg-blue-600 text-white px-8 py-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center text-lg font-semibold pulse-animation"
                        >
                            <Icons.Payment />
                            ‎  ‎ Payer
                        </motion.button>
                    </Link>
                </div>

                {/* Boutons secondaires */}
                <div className="flex justify-center space-x-4">
                    <Link href="/company-info" passHref>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-full hover:bg-gray-300 transition-colors flex items-center"
                        >
                            <Icons.ArrowLeft />
                            ‎ ‎  Retour au formulaire
                        </motion.button>
                    </Link>
                    <Link href="/customize" passHref>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors flex items-center  "
                        >
                            Personnaliser davantage ‎
                            <Icons.Settings />
                        </motion.button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

const Section: React.FC<{
    title: string;
    isEditing: boolean;
    onEdit: () => void;
    onSave: () => void;
    children: React.ReactNode;
}> = ({ title, isEditing, onEdit, onSave, children }) => (
    <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
            {isEditing ? (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onSave}
                    className="text-green-600 hover:text-green-800"
                >
                    <Icons.Check />
                </motion.button>
            ) : (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onEdit}
                    className="text-blue-600 hover:text-blue-800"
                >
                    <Icons.Edit />
                </motion.button>
            )}
        </div>
        {children}
    </div>
);

export default RecapComponent;
