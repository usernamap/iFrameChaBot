import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChatbotConfig, CompanyInfo } from '@/types';
import { Icons } from '@/components/common/Icons';

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
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async () => {
        setIsProcessing(true);
        // Simuler un traitement de paiement
        setTimeout(() => {
            setIsProcessing(false);
            onPaymentSuccess();
        }, 2000);
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
                    <span className="font-bold">{selectedSubscription.price} € / mois</span>
                </div>
                <div className="flex justify-between font-bold mt-4 text-lg text-primary">
                    <span>Total TTC</span>
                    <span>{selectedSubscription.price} €</span>
                </div>
            </div>

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
                        Traitement en cours...
                    </>
                ) : (
                    <>
                        <Icons.Lock />
                        ‎ ‎ Payer {selectedSubscription.price} € maintenant
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
                <p>En procédant au paiement, vous acceptez nos <a href="#" className="text-primary hover:underline">conditions générales de vente</a> et notre <a href="#" className="text-primary hover:underline">politique de confidentialité</a>.</p>
            </div>
        </motion.div>
    );
};

export default PaymentSummaryComponent;