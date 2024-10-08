import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/index';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Icons } from '@/components/common/Icons';
import usePersistedState from '@/contexts/usePersistedState';
import axios from 'axios';
import { ChatbotConfig, CompanyInfo } from '@/types';
import ContactComponent from '@/components/payment/ContactComponent';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Styles pour le PDF
const styles = StyleSheet.create({
    page: { padding: 30 },
    title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
    section: { margin: 10, padding: 10 },
    header: { fontSize: 18, marginBottom: 10 },
    text: { fontSize: 12, marginBottom: 5 },
    total: { fontSize: 16, marginTop: 20, textAlign: 'right' },
});

let orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();
// Composant pour le PDF
const InvoicePDF = ({ orderNumber, companyInfo, selectedSubscription }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.title}>Facture Aliatech</Text>
            <View style={styles.section}>
                <Text style={styles.header}>Informations client</Text>
                <Text style={styles.text}>Entreprise : {companyInfo.name}</Text>
                <Text style={styles.text}>Email : {companyInfo.contact.email}</Text>
                <Text style={styles.text}>Téléphone : {companyInfo.contact.phone}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.header}>Détails de la commande</Text>
                <Text style={styles.text}>Numéro de commande : {orderNumber}</Text>
                <Text style={styles.text}>Date : {format(new Date(), 'dd MMMM yyyy', { locale: fr })}</Text>
                <Text style={styles.text}>Formule : {selectedSubscription.name}</Text>
                <Text style={styles.text}>Prix mensuel : {selectedSubscription.price.toFixed(2)} €</Text>
            </View>
            <Text style={styles.total}>Total : {selectedSubscription.price.toFixed(2)} € / mois</Text>
        </Page>
    </Document>
);

const SuccessPage: React.FC = () => {
    const router = useRouter();
    const [chatbotConfig] = usePersistedState<ChatbotConfig | null>('chatbotConfig', null);
    const [companyInfo] = usePersistedState<CompanyInfo | null>('companyInfo', null);
    const [selectedSubscription] = usePersistedState('selectedSubscription', null);
    const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [isServerAvailable, setIsServerAvailable] = useState(true); // Nouvel état pour gérer la disponibilité du serveur
    const [showContactModal, setShowContactModal] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    // Récupérer le décompte depuis le serveur
    useEffect(() => {
        const fetchCountdown = async () => {
            try {
                const response = await axios.get('http://localhost:3002/api/countdown/countdown');
                if (response.data && response.data.hours !== null) {
                    setCountdown({
                        hours: response.data.hours,
                        minutes: response.data.minutes,
                        seconds: response.data.seconds,
                    });
                    setIsServerAvailable(true); // Serveur disponible
                }
            } catch (error) {
                console.error('Erreur lors de la récupération du décompte:', error);
                setIsServerAvailable(false); // Serveur indisponible
            }
        };

        fetchCountdown();

        // Mettre à jour le décompte toutes les secondes côté client en fonction de la valeur récupérée
        const interval = setInterval(() => {
            setCountdown(prevCountdown => {
                const { hours, minutes, seconds } = prevCountdown;
                if (seconds > 0) {
                    return { ...prevCountdown, seconds: seconds - 1 };
                } else if (minutes > 0) {
                    return { hours, minutes: minutes - 1, seconds: 59 };
                } else if (hours > 0) {
                    return { hours: hours - 1, minutes: 59, seconds: 59 };
                } else {
                    return prevCountdown;
                }
            });
        }, 1000);

        return () => clearInterval(interval); // Nettoyer l'intervalle
    }, []);



    if (!chatbotConfig || !companyInfo || !selectedSubscription) {
        router.push('/customize');
        return null;
    }

    const steps = [
        { icon: <Icons.FileCheck />, title: "Commande confirmée" },
        { icon: <Icons.Settings />, title: "Configuration en cours" },
        { icon: <Icons.UserCheck />, title: "Vérification qualité" },
        { icon: <Icons.Zap />, title: "Activation de votre assistant" }
    ];

    return (
        <Layout title="Commande confirmée - AlimyAI">
            <div className="container mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 mb-8"
                >
                    <div className="flex items-center justify-center mb-6">
                        <Icons.circleCheck />
                        <h1 className="text-3xl font-bold ml-4 text-primary">Félicitations, votre commande est confirmée !</h1>
                    </div>
                    <p className="text-center text-xl mb-6">
                        Merci pour votre confiance, <span className="font-semibold">{companyInfo.name}</span> ! Votre parcours vers l'innovation commence maintenant.
                    </p>
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                        <p className="font-semibold text-green-700">Votre assistant IA personnalisé est en cours de préparation</p>
                        <p className="text-green-600">Notre équipe d'experts travaille activement pour vous offrir une expérience sur mesure.</p>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4 text-primary">Progression de votre commande</h3>
                        <div className="flex justify-between items-center">
                            {steps.map((step, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <div className={`rounded-full p-3 ${index + 1 <= currentStep ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                                        {step.icon}
                                    </div>
                                    <p className="text-xs mt-2 text-center max-w-[80px]">{step.title}</p>
                                </div>
                            ))}
                        </div>
                        <div className="w-full bg-gray-200 h-2 mt-4 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-primary"
                                initial={{ width: "0%" }}
                                animate={{ width: `${(currentStep / steps.length) * 100}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>

                    {/* Condition pour afficher le décompte uniquement si le serveur est disponible */}
                    {isServerAvailable ? (
                        <div className="text-center mb-6">
                            <p className="text-lg font-semibold mb-2">Temps estimé avant la livraison :</p>
                            <div className="text-4xl font-bold text-primary">
                                {countdown.hours !== undefined && countdown.minutes !== undefined && countdown.seconds !== undefined
                                    ? `${countdown.hours.toString().padStart(2, '0')}:
                                        ${countdown.minutes.toString().padStart(2, '0')}:
                                        ${countdown.seconds.toString().padStart(2, '0')}`
                                    : '00:00:00'}
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                Date de livraison estimée : {format(addDays(new Date(), 1), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                            </p>
                        </div>
                    ) : (
                        <div className="text-center text-red-500">Impossible de récupérer le décompte, réessayez plus tard.</div>
                    )}


                    <div className="flex justify-center space-x-4">
                        <PDFDownloadLink
                            document={<InvoicePDF orderNumber={orderNumber} companyInfo={companyInfo} selectedSubscription={selectedSubscription} />}
                            fileName="facture_aliatech.pdf"
                        >
                            <motion.button
                                className="bg-secondary text-white px-6 py-2 rounded-full hover:bg-secondary-dark transition-colors flex items-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Icons.Download />
                                Télécharger la facture PDF
                            </motion.button>
                        </PDFDownloadLink>
                        <motion.button
                            onClick={() => setShowContactModal(true)}
                            className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark transition-colors flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Icons.Phone />
                            Contacter le support
                        </motion.button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 mb-8"
                >
                    <h2 className="text-2xl font-bold mb-6 text-primary">Récapitulatif de votre commande</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Informations client</h3>
                            <p><strong>Entreprise :</strong> {companyInfo.name}</p>
                            <p><strong>Email :</strong> {companyInfo.contact.email}</p>
                            <p><strong>Téléphone :</strong> {companyInfo.contact.phone}</p>
                            <p><strong>Secteur d'activité :</strong> {companyInfo.industry}</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Détails de la commande</h3>
                            <p><strong>Date :</strong> {format(new Date(), 'dd MMMM yyyy', { locale: fr })}</p>
                            <p><strong>Numéro de commande :</strong> {orderNumber}</p>
                            <p><strong>Formule :</strong> {selectedSubscription.name}</p>
                            <p><strong>Prix mensuel :</strong> {selectedSubscription.price.toFixed(2)} €</p>
                        </div>
                    </div>
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-4">Fonctionnalités incluses</h3>
                        <ul className="list-disc list-inside grid grid-cols-1 md:grid-cols-2 gap-2">
                            {selectedSubscription.features.map((feature, index) => (
                                <li key={index} className="text-gray-700">{feature}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-8 text-right">
                        <p className="text-3xl font-bold text-primary">Total : {selectedSubscription.price.toFixed(2)} € / mois</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8"
                >
                    <h3 className="text-2xl font-semibold mb-4 text-blue-800">Prochaines étapes</h3>
                    <ul className="space-y-4">
                        <li className="flex items-start">
                            <Icons.Settings />
                            <div className='ml-2'>
                                <p className="text-blue-600">Notre équipe travaille sur la personnalisation de votre assistant selon vos spécifications.</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <Icons.Mail />
                            <div className='ml-2'>
                                <p className="font-semibold text-blue-700">Notification par email</p>
                                <p className="text-blue-600">Vous recevrez un email dès que votre assistant sera prêt à l'emploi.</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <Icons.Video />
                            <div className='ml-2'>
                                <p className="font-semibold text-blue-700">Session d'onboarding personnalisée</p>
                                <p className="text-blue-600">Un expert vous contactera pour planifier une session d'introduction à votre nouvel assistant IA.</p>
                            </div>
                        </li>
                    </ul>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 mb-8"
                >
                    <h3 className="text-2xl font-semibold mb-6 text-primary">Pourquoi choisir Aliatech ?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start">
                            <Icons.Zap />
                            <div className='ml-2'>
                                <h4 className="font-semibold text-lg mb-2">Technologie de pointe</h4>
                                <p className="text-gray-600">Notre IA utilise les dernières avancées en matière d'apprentissage automatique pour offrir des réponses précises et pertinentes.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <Icons.Lock />
                            <div className='ml-2'>
                                <h4 className="font-semibold text-lg mb-2">Sécurité maximale</h4>
                                <p className="text-gray-600">Vos données sont cryptées et protégées selon les normes les plus strictes de l'industrie.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <Icons.Users />
                            <div className='ml-2'>
                                <h4 className="font-semibold text-lg mb-2">Support client dédié</h4>
                                <p className="text-gray-600">Notre équipe d'experts est disponible 24/7 pour répondre à vos questions et vous accompagner.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <Icons.TrendingUp />
                            <div className='ml-2'>
                                <h4 className="font-semibold text-lg mb-2">Amélioration continue</h4>
                                <p className="text-gray-600">Votre assistant IA s'améliore constamment grâce à nos mises à jour régulières et à l'apprentissage continu.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="text-center mt-12"
                >
                    <h3 className="text-2xl font-semibold mb-4 text-primary">Besoin d'aide ou d'informations supplémentaires ?</h3>
                    <p className="text-lg mb-6">Notre équipe support est là pour vous aider à chaque étape de votre parcours avec Aliatech.</p>
                    <motion.button
                        onClick={() => setShowContactModal(true)}
                        className="bg-primary text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-primary-dark transition-colors flex items-center mx-auto"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Icons.Phone />
                        Contactez-nous
                    </motion.button>
                </motion.div>
            </div>

            <AnimatePresence>
                {showContactModal && (
                    <ContactComponent onClose={() => setShowContactModal(false)} />
                )}
            </AnimatePresence>
        </Layout>
    );
};

export default SuccessPage;
