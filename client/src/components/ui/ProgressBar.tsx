import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
    currentProgress: number; // Valeur entre 0 et 100
    maxProgress: number; // Valeur entre 0 et 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentProgress, maxProgress }) => {
    const steps = ['Infos de base', 'Contact', 'Services', 'Marque', 'FAQ', 'Politiques', 'Équipe', 'Autres infos'];
    const stepCount = steps.length;
    const currentStep = Math.min(Math.floor((currentProgress / 100) * stepCount), stepCount - 1);
    const maxStep = Math.min(Math.floor((maxProgress / 100) * stepCount), stepCount - 1);

    return (
        <div className="w-full mb-8">
            <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                    <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary-light">
                            Progression
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-primary">
                            {Math.round(maxProgress)}%
                        </span>
                    </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <motion.div
                        style={{ width: `${maxProgress}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-light"
                        initial={{ width: 0 }}
                        animate={{ width: `${maxProgress}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <motion.div
                            style={{ width: `${(currentProgress / maxProgress) * 100}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary h-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(currentProgress / maxProgress) * 100}%` }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                    </motion.div>
                </div>
            </div>
            <div className="flex justify-between mt-2">
                {steps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <div
                            className={`w-4 h-4 rounded-full mb-1 ${index < maxStep
                                ? 'bg-primary'
                                : index === maxStep
                                    ? 'bg-primary-light border-2 border-primary'
                                    : 'bg-gray-300'
                                }`}
                        />
                        <span className={`text-xs ${index === currentStep ? 'font-bold text-primary' : 'text-gray-500'
                            }`}>
                            {step}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProgressBar;