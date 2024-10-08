import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { InputWithLabel } from '@/components/ui/InputWithLabel';
import { SelectWithLabel } from '@/components/ui/SelectWithLabel';
import { SwitchWithLabel } from '@/components/ui/SwitchWithLabel';
import { SliderWithLabel } from '@/components/ui/SliderWithLabel';
import ColorPicker from './ColorPicker';
import FontSelector from './FontSelector';
import FileUpload from './FileUpload';
import QuickReplyInput from './QuickReplyInput';
import TypingAnimation from './TypingAnimation';
import OpeningBubble from './OpeningBubble';
import SendButtonPreview from './SendButtonPreview';
import DarkModeLogoPreview from './DarkModeLogoPreview';
import TTSLogoPreview from './TTSLogoPreview';
import { ChatbotConfig } from '../../types';
import { Icons } from '@/components/common/Icons';
import usePersistedState from '@/contexts/usePersistedState';
import Link from 'next/link';


interface ChatbotCustomizationProps {
    config: ChatbotConfig;
    onConfigChange: (config: ChatbotConfig) => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const ChatbotCustomization: React.FC<ChatbotCustomizationProps> = ({
    config,
    onConfigChange,
    activeTab,
    setActiveTab,
}) => {
    const [statusType, setStatusType] = usePersistedState('statusType', config.statusConfig.type || 'none');
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipContent, setTooltipContent] = useState('');
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio();
    }, []);

    const updateStatusMessage = (status: 'online' | 'away' | 'offline', value: string) => {
        const updatedStatusMessages = {
            ...config.STATUS_MESSAGES,
            [status]: value
        };
        updateConfig('STATUS_MESSAGES', updatedStatusMessages);
    };

    const ttsVoices = [
        { key: 'nova', value: 'nova', label: 'Nova' },
        { key: 'alloy', value: 'alloy', label: 'Alloy' },
        { key: 'echo', value: 'echo', label: 'Echo' },
        { key: 'fable', value: 'fable', label: 'Fable' },
        { key: 'onyx', value: 'onyx', label: 'Onyx' },
        { key: 'shimmer', value: 'shimmer', label: 'Shimmer' },
    ];

    const DEFAULT_COLORS = {
        primaryColor: '#2564eb',
        textColor: '#ffffff ',
        userMessageBackgroundColor: '#2564eb',
        userMessageTextColor: '#FFFFFF',
        botMessageBackgroundColor: '#e5e7eb',
        botMessageTextColor: '#333333',
        typingAnimationColor: '#6b7280',
        openingBubbleColor: '#1D4ED8',
    };

    const resetFont = () => {
        const updatedConfig = {
            ...config,
            fontFamily: '',
        };
        onConfigChange(updatedConfig);
    };

    const resetFontSize = () => {
        const updatedConfig = {
            ...config,
            fontSize: '14px',
        };
        onConfigChange(updatedConfig);
    };

    const resetColors = () => {
        const updatedConfig = {
            ...config,
            ...DEFAULT_COLORS,
        };
        onConfigChange(updatedConfig);
    };

    const updateConfig = (key: keyof ChatbotConfig, value: any) => {
        const updatedConfig = { ...config, [key]: value };
        onConfigChange(updatedConfig);
    };

    const updateTTSConfig = (updates: Partial<ChatbotConfig['ttsConfig']>) => {
        const newTtsConfig = { ...config.ttsConfig, ...updates };
        updateConfig('ttsConfig', newTtsConfig);

        if (audioRef.current) {
            if ('defaultSpeed' in updates) {
                audioRef.current.playbackRate = updates.defaultSpeed as number;
            }
            if ('defaultVolume' in updates) {
                audioRef.current.volume = updates.defaultVolume as number;
            }
        }
    };

    useEffect(() => {
        const enabledVoices = ttsVoices.filter(voice => config.ttsConfig.enabledVoices[voice.key]);
        if (enabledVoices.length > 0 && !enabledVoices.some(voice => voice.value === config.ttsConfig.defaultVoice)) {
            updateTTSConfig({ defaultVoice: enabledVoices[0].value });
        }
    }, [config.ttsConfig.enabledVoices, config.ttsConfig.defaultVoice]);

    const playAudio = (voice: string) => {
        if (audioRef.current) {
            audioRef.current.src = `/audio/${voice}.mp3`;
            audioRef.current.playbackRate = config.ttsConfig.defaultSpeed;
            audioRef.current.volume = config.ttsConfig.defaultVolume;
            audioRef.current.play();
        }
    };

    const handleTooltip = (content: string) => {
        setTooltipContent(content);
        setShowTooltip(true);
    };

    const renderTTSOptions = () => (
        <div className="ml-6 space-y-4">
            {ttsVoices.map((voice) => (
                <SwitchWithLabel
                    key={voice.key}
                    id={`enableVoice${voice.key}`}
                    checked={config.ttsConfig.enabledVoices[voice.key]}
                    onCheckedChange={(checked) => {
                        const newEnabledVoices = { ...config.ttsConfig.enabledVoices, [voice.key]: checked };
                        updateTTSConfig({ enabledVoices: newEnabledVoices });

                        if (!checked && config.ttsConfig.defaultVoice === voice.value) {
                            const newDefaultVoice = Object.keys(newEnabledVoices).find(key => newEnabledVoices[key]) || '';
                            updateTTSConfig({ defaultVoice: newDefaultVoice });
                        }
                    }}
                    label={voice.label}
                    onTooltip={() => handleTooltip(`Activez cette voix pour la synthèse vocale: ${voice.label}.`)}
                />
            ))}
            <SwitchWithLabel
                id="enableSpeedControl"
                checked={config.ttsConfig.enableSpeedControl}
                onCheckedChange={(checked) => updateTTSConfig({ enableSpeedControl: checked })}
                label="Contrôle de la vitesse"
                onTooltip={() => handleTooltip("Activez cette option pour permettre aux utilisateurs de contrôler la vitesse de la synthèse vocale.")}
            />
            <SwitchWithLabel
                id="enableVolumeControl"
                checked={config.ttsConfig.enableVolumeControl}
                onCheckedChange={(checked) => updateTTSConfig({ enableVolumeControl: checked })}
                label="Contrôle du volume"
                onTooltip={() => handleTooltip("Activez cette option pour permettre aux utilisateurs de contrôler le volume de la synthèse vocale.")}
            />
            <SelectWithLabel
                id="defaultSpeed"
                label="Vitesse par défaut"
                value={config.ttsConfig.defaultSpeed.toString()}
                onChange={(value) => {
                    const speed = parseFloat(value);
                    updateTTSConfig({ defaultSpeed: speed });
                    if (audioRef.current) {
                        audioRef.current.playbackRate = speed;
                    }
                }}
                options={[
                    { value: '0.5', label: 'Lent (0.5x)' },
                    { value: '0.75', label: 'Modéré (0.75x)' },
                    { value: '1', label: 'Normal (1x)' },
                    { value: '1.25', label: 'Rapide (1.25x)' },
                    { value: '1.5', label: 'Très rapide (1.5x)' },
                ]}
                onTooltip={() => handleTooltip("Choisissez la vitesse de lecture par défaut pour la synthèse vocale.")}
            />
            <SelectWithLabel
                id="defaultVolume"
                label="Volume par défaut"
                value={config.ttsConfig.defaultVolume.toString()}
                onChange={(value) => {
                    const volume = parseFloat(value);
                    updateTTSConfig({ defaultVolume: volume });
                    if (audioRef.current) {
                        audioRef.current.volume = volume;
                    }
                }}
                options={[
                    { value: '0.25', label: 'Très bas (25%)' },
                    { value: '0.5', label: 'Bas (50%)' },
                    { value: '0.75', label: 'Moyen (75%)' },
                    { value: '1', label: 'Haut (100%)' },
                ]}
                onTooltip={() => handleTooltip("Choisissez le volume par défaut pour la synthèse vocale.")}
            />
            <SelectWithLabel
                id="defaultVoice"
                label="Voix par défaut"
                value={config.ttsConfig.defaultVoice}
                onChange={(value) => {
                    updateTTSConfig({ defaultVoice: value });
                    playAudio(value);
                }}
                options={ttsVoices
                    .filter(voice => config.ttsConfig.enabledVoices[voice.key])
                    .map(voice => ({
                        value: voice.value,
                        label: voice.label,
                    }))}
                onTooltip={() => handleTooltip("Choisissez la voix par défaut pour la synthèse vocale.")}
            />
            <motion.button
                onClick={() => playAudio(config.ttsConfig.defaultVoice)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Icons.VolumeUp />
                Tester la voix
            </motion.button>
        </div>
    );

    const tabVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    };

    const tabContent = {
        features: (
            <motion.div
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.5 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Fonctionnalités</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <SwitchWithLabel
                            id='enableDarkMode'
                            checked={config.enableDarkMode}
                            onCheckedChange={(checked) => updateConfig('enableDarkMode', checked)}
                            label="Mode sombre"
                            onTooltip={() => handleTooltip("Activez cette option pour permettre aux utilisateurs de basculer en mode sombre.")}
                        />
                        <SwitchWithLabel
                            id='enableTTS'
                            checked={config.enableTTS}
                            onCheckedChange={(checked) => updateConfig('enableTTS', checked)}
                            label="Synthèse vocale (TTS)"
                            onTooltip={() => handleTooltip("Activez cette option pour permettre la lecture audio des messages du chatbot.")}
                        />
                        {config.enableTTS && renderTTSOptions()}
                        <SwitchWithLabel
                            id='enableQuickReplies'
                            checked={config.enableQuickReplies}
                            onCheckedChange={(checked) => updateConfig('enableQuickReplies', checked)}
                            label="Réponses rapides"
                            onTooltip={() => handleTooltip("Activez cette option pour afficher des boutons de réponses rapides dans le chatbot.")}
                        />
                        {config.enableQuickReplies && (
                            <QuickReplyInput
                                quickReplies={config.quickReplies}
                                onChange={(quickReplies) => updateConfig('quickReplies', quickReplies)}
                                onTooltip={() => handleTooltip("Ajoutez des réponses rapides que les utilisateurs pourront sélectionner d'un simple clic.")}
                                tooltip="Ajoutez des réponses rapides que les utilisateurs pourront sélectionner d' un simple clic."
                            />
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        ),
        messages: (
            <motion.div
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.5 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Messages</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <InputWithLabel
                            label="Message de bienvenue"
                            value={config.welcomeMessage}
                            onChange={(e) => updateConfig('welcomeMessage', e.target.value)}
                            onTooltip={() => handleTooltip("Ce message sera affiché lorsque l'utilisateur ouvrira le chatbot pour la première fois.")}
                        />
                        <InputWithLabel
                            label="Titre"
                            value={config.headerTitle}
                            onChange={(e) => updateConfig('headerTitle', e.target.value)}
                            onTooltip={() => handleTooltip("Ce titre sera affiché en haut de la fenêtre du chatbot.")}
                        />
                        <InputWithLabel
                            label="Texte du bouton d'envoi"
                            value={config.placeholderText}
                            onChange={(e) => updateConfig('placeholderText', e.target.value)}
                            onTooltip={() => handleTooltip("Ce texte sera affiché dans la zone de saisie du chatbot pour inviter l'utilisateur à écrire un message.")}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <InputWithLabel
                                label="Texte - En ligne"
                                value={config.STATUS_MESSAGES.online}
                                onChange={(e) => updateStatusMessage('online', e.target.value)}
                                onTooltip={() => handleTooltip("Entrez le texte qui sera affiché lorsque le chatbot est en ligne.")}
                            />
                            <InputWithLabel
                                label="Texte - Absent"
                                value={config.STATUS_MESSAGES.away}
                                onChange={(e) => updateStatusMessage('away', e.target.value)}
                                onTooltip={() => handleTooltip("Entrez le texte qui sera affiché lorsque le chatbot est absent.")}
                            />
                            <InputWithLabel
                                label="Texte - Hors ligne"
                                value={config.STATUS_MESSAGES.offline}
                                onChange={(e) => updateStatusMessage('offline', e.target.value)}
                                onTooltip={() => handleTooltip("Entrez le texte qui sera affiché lorsque le chatbot est hors ligne.")}
                            />
                        </div>
                        {/* <SwitchWithLabel
                            id='enableStatus'
                            checked={config.enableStatus}
                            onCheckedChange={(checked) => {
                                updateConfig('enableStatus', checked);
                                if (!checked) setStatusType('none');
                            }}
                            label="Activer le statut"
                            onTooltip={() => handleTooltip("Activez cette option pour afficher un statut personnalisé pour votre chatbot.")}
                        /> 
                         {config.enableStatus && (
                            <>
                                <SelectWithLabel
                                    id="statusType"
                                    label="Type de statut"
                                    value={statusType}
                                    onChange={(value) => {
                                        setStatusType(value);
                                        updateConfig('statusConfig', { ...config.statusConfig, type: value });
                                    }}
                                    options={[
                                        { value: 'dot', label: 'Pastille' },
                                        { value: 'logo', label: 'Logo' },
                                        { value: 'text', label: 'Texte' },
                                    ]}
                                    onTooltip={() => handleTooltip("Choisissez si vous voulez afficher une pastille, un logo ou un texte comme indicateur de statut.")}
                                />
                                {statusType === 'dot' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <ColorPicker
                                            label="Couleur - En ligne"
                                            color={config.statusConfig.dotColors?.online || '#45FF00'}
                                            onChange={(color) =>
                                                updateConfig('statusConfig', {
                                                    ...config.statusConfig,
                                                    dotColors: {
                                                        ...config.statusConfig.dotColors,
                                                        online: color,
                                                    },
                                                })
                                            }
                                            onTooltip={() => handleTooltip("Choisissez la couleur de la pastille pour indiquer que le chatbot est en ligne.")}
                                            tooltip='Choisissez la couleur de la pastille pour indiquer que le chatbot est en ligne.'
                                        />
                                        <ColorPicker
                                            label="Couleur - Absent"
                                            color={config.statusConfig?.dotColors?.away || '#FFA500'}
                                            onChange={(color) =>
                                                updateConfig('statusConfig', {
                                                    ...config.statusConfig,
                                                    dotColors: {
                                                        ...config.statusConfig.dotColors,
                                                        away: color,
                                                    },
                                                })
                                            }
                                            onTooltip={() => handleTooltip("Choisissez la couleur de la pastille pour indiquer que le chatbot est absent.")}
                                            tooltip='Choisissez la couleur de la pastille pour indiquer que le chatbot est absent.'
                                        />
                                        <ColorPicker
                                            label="Couleur - Hors ligne"
                                            color={config.statusConfig?.dotColors?.offline || '#FF0000'}
                                            onChange={(color) =>
                                                updateConfig('statusConfig', {
                                                    ...config.statusConfig,
                                                    dotColors: {
                                                        ...config.statusConfig.dotColors,
                                                        offline: color,
                                                    },
                                                })
                                            }
                                            onTooltip={() => handleTooltip("Choisissez la couleur de la pastille pour indiquer que le chatbot est hors ligne.")}
                                            tooltip='Choisissez la couleur de la pastille pour indiquer que le chatbot est hors ligne.'
                                        />
                                    </div>
                                )}
                                {statusType === 'logo' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <FileUpload
                                            label="Logo - En ligne"
                                            onChange={(file) => updateConfig('statusConfig', { ...config.statusConfig, logoOnline: file })}
                                            onTooltip={() => handleTooltip("Téléchargez un logo personnalisé pour indiquer le statut en ligne.")}
                                        />
                                        <FileUpload
                                            label="Logo - Absent"
                                            onChange={(file) => updateConfig('statusConfig', { ...config.statusConfig, logoAway: file })}
                                            onTooltip={() => handleTooltip("Téléchargez un logo personnalisé pour indiquer le statut absent.")}
                                        />
                                        <FileUpload
                                            label="Logo - Hors ligne"
                                            onChange={(file) => updateConfig('statusConfig', { ...config.statusConfig, logoOffline: file })}
                                            onTooltip={() => handleTooltip("Téléchargez un logo personnalisé pour indiquer le statut hors ligne.")}
                                        />
                                    </div>
                                )}
                                {statusType === 'text' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <InputWithLabel
                                            label="Texte - En ligne"
                                            value={config.statusConfig?.textOnline || 'En ligne'}
                                            onChange={(e) => updateConfig('statusConfig', { ...config.statusConfig, textOnline: e.target.value })}
                                            onTooltip={() => handleTooltip("Entrez le texte qui sera affiché lorsque le chatbot est en ligne.")}
                                        />
                                        <InputWithLabel
                                            label="Texte - Absent"
                                            value={config.statusConfig?.textAway || 'Absent'}
                                            onChange={(e) => updateConfig('statusConfig', { ...config.statusConfig, textAway: e.target.value })}
                                            onTooltip={() => handleTooltip("Entrez le texte qui sera affiché lorsque le chatbot est absent.")}
                                        />
                                        <InputWithLabel
                                            label="Texte - Hors ligne"
                                            value={config.statusConfig?.textOffline || 'Hors ligne'}
                                            onChange={(e) => updateConfig('statusConfig', { ...config.statusConfig, textOffline: e.target.value })}
                                            onTooltip={() => handleTooltip("Entrez le texte qui sera affiché lorsque le chatbot est hors ligne.")}
                                        />
                                    </div>
                                )}
                            </>
                        )} */}
                    </CardContent>
                </Card>
            </motion.div>
        ),
        appearance: (
            <motion.div
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.5 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Apparence</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ColorPicker
                                label="Couleur principale"
                                color={config.primaryColor}
                                onChange={(color) => updateConfig('primaryColor', color)}
                                onTooltip={() => handleTooltip("Cette couleur sera utilisée pour les éléments principaux de votre chatbot.")}
                                tooltip='Cette couleur sera utilisée pour les éléments principaux de votre chatbot.'
                            />
                            <ColorPicker
                                label="Couleur du texte"
                                color={config.textColor}
                                onChange={(color) => updateConfig('textColor', color)}
                                onTooltip={() => handleTooltip("Cette couleur sera appliquée au texte principal de votre chatbot.")}
                                tooltip='Cette couleur sera appliquée au texte principal de votre chatbot.'
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ColorPicker
                                label="Fond messages utilisateur"
                                color={config.userMessageBackgroundColor}
                                onChange={(color) => updateConfig('userMessageBackgroundColor', color)}
                                onTooltip={() => handleTooltip("Cette couleur sera utilisée comme arrière-plan pour les messages de l'utilisateur.")}
                                tooltip="Cette couleur sera utilisée comme arrière-plan pour les messages de l'utilisateur."
                            />
                            <ColorPicker
                                label="Texte messages utilisateur"
                                color={config.userMessageTextColor}
                                onChange={(color) => updateConfig('userMessageTextColor', color)}
                                onTooltip={() => handleTooltip("Cette couleur sera appliquée au texte des messages de l'utilisateur.")}
                                tooltip="Cette couleur sera appliquée au texte des messages de l'utilisateur."
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ColorPicker
                                label="Fond messages bot"
                                color={config.botMessageBackgroundColor}
                                onChange={(color) => updateConfig('botMessageBackgroundColor', color)}
                                onTooltip={() => handleTooltip("Cette couleur sera utilisée comme arrière-plan pour les messages du bot.")}
                                tooltip="Cette couleur sera utilisée comme arrière-plan pour les messages du bot."
                            />
                            <ColorPicker
                                label="Texte messages bot"
                                color={config.botMessageTextColor}
                                onChange={(color) => updateConfig('botMessageTextColor', color)}
                                onTooltip={() => handleTooltip("Cette couleur sera appliquée au texte des messages du bot.")}
                                tooltip="Cette couleur sera appliquée au texte des messages du bot."
                            />
                        </div>
                        <div className="flex justify-center mt-4">
                            <motion.button
                                onClick={resetColors}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Réinitialiser les couleurs
                            </motion.button>
                        </div>

                        <FontSelector
                            font={config.fontFamily}
                            onChange={(font) => updateConfig('fontFamily', font)}
                            onTooltip={() => handleTooltip("Choisissez la police de caractères pour votre chatbot.")}
                            tooltip='Choisissez la police de caractères pour votre chatbot.'
                        />
                        <div className="flex justify-center mt-4">
                            <motion.button
                                onClick={resetFont}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Réinitialiser la police
                            </motion.button>
                        </div>
                        <SliderWithLabel
                            id="fontSize"
                            label="Taille du texte"
                            value={parseInt(config.fontSize)}
                            min={12}
                            max={24}
                            step={1}
                            onChange={(value) => updateConfig('fontSize', `${value}px`)}
                            onTooltip={() => handleTooltip("Ajustez la taille du texte pour votre chatbot.")}
                        />
                        <div className="flex justify-center mt-4">
                            <motion.button
                                onClick={resetFontSize}
                                className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Réinitialiser la taille du texte
                            </motion.button>
                        </div>

                        {/* <SwitchWithLabel
                            id='enableTypingAnimation'
                            checked={config.enableTypingAnimation}
                            onCheckedChange={(checked) => updateConfig('enableTypingAnimation', checked)}
                            label="Animation de frappe"
                            onTooltip={() => handleTooltip("Activez cette option pour afficher une animation de frappe pendant que le bot rédige sa réponse.")}
                        />
                        {config.enableTypingAnimation && (
                            <div className="space-y-4 ml-6">
                                <SelectWithLabel
                                    id="typingAnimationType"
                                    label="Type d'animation de frappe"
                                    value={config.typingAnimationType || 'animation'}
                                    onChange={(value) => updateConfig('typingAnimationType', value)}
                                    options={[
                                        { value: 'animation', label: 'Animation' },
                                        { value: 'texte', label: 'Texte' },
                                        { value: 'logo', label: 'Logo ou .gif' },
                                    ]}
                                    onTooltip={() => handleTooltip("Choisissez le type d'animation de frappe à afficher.")}
                                />
                                {config.typingAnimationType === 'animation' && (
                                    <div className="space-y-2">
                                        <ColorPicker
                                            label="Couleur de l'animation de frappe"
                                            color={config.typingAnimationColor || '#gray-500'}
                                            onChange={(color) => updateConfig('typingAnimationColor', color)}
                                            onTooltip={() => handleTooltip("Choisissez la couleur des points de l'animation de frappe.")}
                                            tooltip="Choisissez la couleur des points de l'animation de frappe."
                                        />
                                        <SliderWithLabel
                                            id="typingAnimationSize"
                                            label="Taille de l'animation de frappe"
                                            value={config.typingAnimationSize || 8}
                                            min={4}
                                            max={16}
                                            step={1}
                                            onChange={(value) => updateConfig('typingAnimationSize', value)}
                                            onTooltip={() => handleTooltip("Ajustez la taille des points de l'animation de frappe.")}
                                        />
                                        <TypingAnimation {
                                            ...{
                                                enableTypingAnimation: true,
                                                typingAnimationType: 'animation',
                                                typingAnimationColor: config.typingAnimationColor,
                                                typingAnimationSize: config.typingAnimationSize,
                                            }
                                        } />
                                    </div>
                                )}
                                {config.typingAnimationType === 'texte' && (
                                    <InputWithLabel
                                        label="Texte de frappe"
                                        value={config.typingText || ''}
                                        onChange={(e) => updateConfig('typingText', e.target.value)}
                                        onTooltip={() => handleTooltip("Modifiez le texte affiché pendant la frappe.")}
                                    />
                                )}
                                {config.typingAnimationType === 'logo' && (
                                    <FileUpload
                                        label="Importer un logo ou .gif"
                                        onChange={(file) => updateConfig('typingLogo', file)}
                                        onTooltip={() => handleTooltip("Téléchargez un logo ou .gif personnalisé pour l'animation de frappe.")}
                                    />
                                )}
                            </div>
                        )} */}
                        {/* <Card>
                            <CardHeader>
                                <CardTitle>Bulle d'ouverture du chat</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <ColorPicker
                                        label="Couleur de la bulle d'ouverture"
                                        color={config.openingBubbleColor || '#1D4ED8'}
                                        onChange={(color) => updateConfig('openingBubbleColor', color)}
                                        onTooltip={() => handleTooltip("Choisissez la couleur de la bulle d'ouverture du chat.")}
                                        tooltip="Choisissez la couleur de la bulle d'ouverture du chat."
                                    />
                                    <div className="space-y-4">
                                        <SliderWithLabel
                                            id="openingBubbleWidth"
                                            label="Largeur de la bulle d'ouverture"
                                            value={parseInt(config.openingBubbleWidth) || 60}
                                            min={40}
                                            max={100}
                                            step={5}
                                            onChange={(value) => updateConfig('openingBubbleWidth', `${value}px`)}
                                            onTooltip={() => handleTooltip("Ajustez la largeur de la bulle d'ouverture du chat.")}
                                        />
                                        <SliderWithLabel
                                            id="openingBubbleHeight"
                                            label="Hauteur de la bulle d'ouverture"
                                            value={parseInt(config.openingBubbleHeight) || 60}
                                            min={40}
                                            max={100}
                                            step={5}
                                            onChange={(value) => updateConfig('openingBubbleHeight', `${value}px`)}
                                            onTooltip={() => handleTooltip("Ajustez la hauteur de la bulle d'ouverture du chat.")}
                                        />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Aperçu</CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex justify-center">
                                            <OpeningBubble
                                                config={config}
                                                toggleChat={() => { }}
                                                isOpen={false}
                                                isMobile={false}
                                                isButtonClicked={false}
                                            />
                                        </CardContent>
                                    </Card>
                                </div>
                                <FileUpload
                                    label="Icône de la bulle d'ouverture"
                                    onChange={(file) => updateConfig('openingBubbleIcon', file)}
                                    onTooltip={() => handleTooltip("Téléchargez une icône personnalisée pour la bulle d'ouverture du chat.")}
                                />
                            </CardContent>
                        </Card> */}
                        {/* {config.enableDarkMode && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Logo Mode Sombre</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <FileUpload
                                        label="Logo mode sombre"
                                        onChange={(file) => updateConfig('darkModeLogo', file)}
                                        onTooltip={() => handleTooltip("Téléchargez un logo spécifique pour le mode sombre de votre chatbot.")}
                                    />
                                    <div className="mt-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Aperçu</CardTitle>
                                            </CardHeader>
                                            <CardContent className="flex justify-center">
                                                <DarkModeLogoPreview config={config} />
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CardContent>
                            </Card>
                        )} */}

                        {/* {config.enableTTS && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Logo TTS</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <FileUpload
                                        label="Logo TTS"
                                        onChange={(file) => updateConfig('ttsLogo', file)}
                                        onTooltip={() => handleTooltip("Téléchargez un logo pour la fonctionnalité de synthèse vocale (TTS).")}
                                    />
                                    <div className="mt-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Aperçu</CardTitle>
                                            </CardHeader>
                                            <CardContent className="flex justify-center">
                                                <TTSLogoPreview config={config} />
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CardContent>
                            </Card>
                        )} */}
                    </CardContent>
                </Card>

                {/* <Card>
                    <CardHeader>
                        <CardTitle>Icône du Bouton d'Envoi</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FileUpload
                            label="Icône du bouton d'envoi"
                            onChange={(file) => updateConfig('sendButtonIcon', file)}
                            onTooltip={() => handleTooltip("Téléchargez une icône personnalisée pour le bouton d'envoi du chat.")}
                        />
                        <div className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Aperçu</CardTitle>
                                </CardHeader>
                                <CardContent className="flex justify-center">
                                    <SendButtonPreview config={config} />
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card> */}
            </motion.div>
        ),
    };

    return (
        <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="features" className="flex items-center justify-center" >
                        <Icons.Zap />
                        Fonctionnalités
                    </TabsTrigger>
                    <TabsTrigger value="messages" className="flex items-center justify-center">
                        <Icons.MessageCircle />
                        Messages
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="flex items-center justify-center">
                        <Icons.Palette />
                        Apparence
                    </TabsTrigger>
                </TabsList>
            </Tabs>
            <AnimatePresence mode="wait">
                {tabContent[activeTab as keyof typeof tabContent]}
            </AnimatePresence>

            <AnimatePresence>
                {showTooltip && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg shadow-lg max-w-md z-50"
                    >
                        {tooltipContent}
                        <button
                            className="absolute top-2 right-2 text-white"
                            onClick={() => setShowTooltip(false)}
                        >
                            <Icons.X />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatbotCustomization;