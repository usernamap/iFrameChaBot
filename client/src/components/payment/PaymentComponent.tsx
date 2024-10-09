import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChatbotConfig, CompanyInfo } from '@/types/index';

interface PaymentComponentProps {
    chatbotConfig: ChatbotConfig;
    companyInfo: CompanyInfo;
    onPaymentSuccess: () => void;
}

const PaymentComponent: React.FC<PaymentComponentProps> = ({ chatbotConfig, companyInfo, onPaymentSuccess }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const calculateTotal = () => {
        // Même logique que dans RecapComponent
        let total = 29.99;
        if (chatbotConfig.enableTTS) total += 9.99;
        if (chatbotConfig.enableDarkMode) total += 4.99;
        return total.toFixed(2);
    };

    const handlePayment = async () => {
        setIsProcessing(true);
        // Simuler un processus de paiement
        setTimeout(() => {
            setIsProcessing(false);
            onPaymentSuccess();
        }, 2000);
    };

    return (
        <motion.div
            className="bg-white p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-2xl font-bold mb-4">Paiement sécurisé</h2>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="font-semibold">Total à payer :</span>
                    <span className="text-2xl font-bold text-primary">{calculateTotal()}€</span>
                </div>
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded" role="alert">
                    <p className="font-bold">Paiement sécurisé</p>
                    <p>Toutes vos informations sont cryptées et sécurisées.</p>
                </div>
                <div className="space-y-2">
                    <input type="text" placeholder="Numéro de carte" className="w-full p-2 border rounded" />
                    <div className="flex space-x-2">
                        <input type="text" placeholder="MM/AA" className="w-1/2 p-2 border rounded" />
                        <input type="text" placeholder="CVC" className="w-1/2 p-2 border rounded" />
                    </div>
                </div>
                <motion.button
                    className={`w-full bg-primary text-white font-bold py-3 px-4 rounded ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-dark '}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePayment}
                    disabled={isProcessing}
                >
                    {isProcessing ? 'Traitement en cours...' : 'Payer maintenant'}
                </motion.button>
                <p className="text-sm text-gray-600 text-center mt-4">
                    En cliquant sur "Payer maintenant", vous acceptez nos conditions générales de vente.
                </p>
            </div>
        </motion.div>
    );
};

export default PaymentComponent;