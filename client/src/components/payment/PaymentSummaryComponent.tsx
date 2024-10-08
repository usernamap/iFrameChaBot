import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatbotConfig, CompanyInfo } from '@/types';
import { Icons } from '@/components/common/Icons';
import usePersistedState from '@/contexts/usePersistedState';
import { toast } from 'react-toastify';
import { format, addMonths, addWeeks } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useRouter } from 'next/router';
import axios from 'axios';

interface PromoCode {
    code: string;
    discount: number;
    freeMonths: number;
}

const availablePromoCodes: PromoCode[] = [
    { code: 'PROMO10', discount: 0.1, freeMonths: 0 },
    { code: 'beta1', discount: 0, freeMonths: 1 },
    { code: 'SUMMER50', discount: 0.5, freeMonths: 0 },
    { code: 'FREEWEEK', discount: 0, freeMonths: 0.25 },
];

interface PaymentSummaryComponentProps {
    chatbotConfig: ChatbotConfig;
    companyInfo: CompanyInfo;
    selectedSubscription: any;
    onPaymentSuccess: () => void;
    autoUpgrade: boolean;
    setAutoUpgrade: (value: boolean) => void;
}

const PaymentSummaryComponent: React.FC<PaymentSummaryComponentProps> = ({
    chatbotConfig,
    companyInfo,
    selectedSubscription,
    onPaymentSuccess,
    autoUpgrade,
    setAutoUpgrade
}) => {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = usePersistedState<PromoCode | null>('appliedPromo', null);
    const [discountAmount, setDiscountAmount] = usePersistedState('discountAmount', 0);
    const [totalPrice, setTotalPrice] = usePersistedState('totalPrice', selectedSubscription?.price || 0);
    const [autoRenew, setAutoRenew] = usePersistedState('autoRenew', true);
    const [orderNumber] = usePersistedState('orderNumber', Math.random().toString(36).substr(2, 9).toUpperCase());
    const [isDataSent, setIsDataSent] = useState(false);



    useEffect(() => {
        if (selectedSubscription) {
            const newPrice = calculatePrice(selectedSubscription.price, appliedPromo);
            setTotalPrice(newPrice);
        }
    }, [selectedSubscription, appliedPromo]);

    const calculatePrice = (basePrice: number, promo: PromoCode | null): number => {
        if (!promo) return basePrice;
        const discountedPrice = basePrice * (1 - promo.discount);
        setDiscountAmount(basePrice - discountedPrice);
        return promo.freeMonths > 0 ? 0 : discountedPrice;
    };

    const handlePayment = async () => {
        setIsProcessing(true);
        if (isFreeperiod) {
            // Redirection vers la page success pour les périodes gratuites
            setTimeout(() => {
                router.push('/success');
                sendDataToServer();
                startCountdown();
            }, 1000);
        } else {
            // Simulation de l'implémentation de Stripe
            console.log('Implémentation future de Stripe : Paiement de', totalPrice.toFixed(2), '€');
            let stripe = false
            if (stripe) {
                setTimeout(() => {
                    onPaymentSuccess();
                    sendDataToServer();
                    startCountdown();
                }, 2000);
            } else {
                setTimeout(() => {
                    setIsProcessing(false);
                    toast.error("Impossible de traiter le paiement. Veuillez réessayer plus tard ou contactez le support.");
                }, 1000);
            }
        }
    };

    const applyPromoCode = (code: string) => {
        const promo = availablePromoCodes.find(p => p.code === code);
        if (promo) {
            setAppliedPromo(promo);
            setPromoCode('');
            toast.success(`Code promo ${code} appliqué avec succès !`);
        } else {
            toast.error('Code promo invalide. Veuillez réessayer.');
        }
    };

    const removePromoCode = () => {
        setAppliedPromo(null);
        setDiscountAmount(0);
        setTotalPrice(selectedSubscription.price);
        toast.info('Code promo supprimé avec succès.');
    };

    const getFreePeriodEndDate = (freeMonths: number): string => {
        const startDate = new Date();
        let endDate;

        if (freeMonths >= 1) {
            endDate = addMonths(startDate, Math.floor(freeMonths));
        } else {
            endDate = addWeeks(startDate, Math.round(freeMonths * 4));
        }

        return format(endDate, "d MMMM yyyy", { locale: fr });
    };

    const sendDataToServer = async () => {
        if (!isDataSent && chatbotConfig && companyInfo && selectedSubscription) {
            try {
                const response = await axios.post('http://localhost:3002/api/order/order', {
                    chatbotConfig,
                    companyInfo,
                    selectedSubscription,
                    orderNumber
                });
                console.log('Données envoyées avec succès:', response.data);
                setIsDataSent(true);
            } catch (error) {
                console.error('Erreur lors de l\'envoi des données:', error);
            }
        }
    };

    const startCountdown = async () => {
        try {
            const response = await axios.post('http://localhost:3002/api/countdown/startCountdown', {
                hours: 1,
                minutes: 30,
                seconds: 0,
            });
            console.log('Décompte démarré:', response.data);
        } catch (error) {
            console.error('Erreur lors du démarrage du décompte:', error);
        }
    };

    if (!selectedSubscription) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
            >
                <h2 className="text-2xl font-bold mb-4 text-primary">Résumé de votre commande</h2>
                <p className="text-red-500">Veuillez sélectionner un abonnement pour continuer.</p>
            </motion.div>
        );
    }

    const isFreeperiod = appliedPromo && appliedPromo.freeMonths > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
        >
            <h2 className="text-2xl font-bold mb-4 text-primary">Résumé de votre commande</h2>

            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                    <span className="font-semibold">{selectedSubscription.name}</span>
                    <span className="font-bold">{selectedSubscription.price.toFixed(2)} € / mois</span>
                </div>
                <AnimatePresence>
                    {appliedPromo && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex justify-between text-green-600 items-center"
                        >
                            <span>
                                Réduction ({appliedPromo.code})
                                {isFreeperiod && (
                                    <span className="block text-sm">
                                        Gratuit jusqu'au {getFreePeriodEndDate(appliedPromo.freeMonths)}
                                    </span>
                                )}
                            </span>
                            <div className="flex items-center">
                                <span>-{discountAmount.toFixed(2)} €</span>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={removePromoCode}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Icons.X />
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="flex justify-between font-bold mt-4 text-lg text-primary">
                    <span>Total {isFreeperiod ? "après la période gratuite" : ""}</span>
                    <span>{totalPrice.toFixed(2)} € / mois</span>
                </div>
            </div>

            <div className="mb-6">
                <div className="flex items-center mb-2">
                    <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Code promo"
                        className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                        disabled={!!appliedPromo}
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => applyPromoCode(promoCode)}
                        className={`px-4 py-2 rounded-r-md transition duration-300 ${appliedPromo ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-dark'
                            }`}
                        disabled={!!appliedPromo}
                    >
                        Appliquer
                    </motion.button>
                </div>
            </div>

            {isFreeperiod && (
                <div className="mb-6">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={autoRenew}
                            onChange={(e) => setAutoRenew(e.target.checked)}
                            className="form-checkbox h-5 w-5 text-primary"
                        />
                        <span className="ml-2 text-sm">
                            Renouveler automatiquement l'abonnement après la période gratuite
                        </span>
                    </label>
                </div>
            )}

            <div className="mb-6">
                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={autoUpgrade}
                        onChange={(e) => setAutoUpgrade(e.target.checked)}
                        className="form-checkbox h-5 w-5 text-primary"
                    />
                    <span className="ml-2 text-sm">
                        Passer automatiquement à l'abonnement supérieur si la limite d'interactions est atteinte
                    </span>
                </label>
            </div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg shadow-lg hover:bg-primary-dark transition duration-300 flex items-center justify-center"
                onClick={handlePayment}
                disabled={isProcessing}
            >
                {isProcessing ? (
                    <>
                        <Icons.Loader />
                        ‎ ‎ Redirection en cours...
                    </>
                ) : (
                    <>
                        <Icons.Lock />
                        ‎ ‎ {isFreeperiod ? "Commencer la période gratuite" : `Payer ${totalPrice.toFixed(2)} € maintenant`}
                    </>
                )}
            </motion.button>

            <div className="mt-4 text-center text-sm text-gray-600">
                <p className="mb-2 flex items-center justify-center">
                    <Icons.Shield /> ‎ ‎
                    Paiement 100% sécurisé
                </p>
                <p className="flex items-center justify-center">
                    <Icons.RefreshCw /> ‎ ‎
                    Satisfait ou remboursé sous 30 jours
                </p>
            </div>

            <div className="mt-6 text-xs text-gray-500">
                <p>En procédant, vous acceptez nos <a href="#" className="text-primary hover:underline">conditions générales de vente</a> et notre <a href="#" className="text-primary hover:underline">politique de confidentialité</a>.</p>
            </div>
        </motion.div>
    );
};

export default PaymentSummaryComponent;