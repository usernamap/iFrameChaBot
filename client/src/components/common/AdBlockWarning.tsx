import React, { useState, useEffect } from 'react';

const AdBlockWarning: React.FC = () => {
    const [isAdBlockDetected, setIsAdBlockDetected] = useState(false);

    useEffect(() => {
        const checkAdBlock = async () => {
            try {
                await fetch('https://r.stripe.com/b', { mode: 'no-cors' });
            } catch (error) {
                setIsAdBlockDetected(true);
            }
        };
        checkAdBlock();
    }, []);

    if (!isAdBlockDetected) return null;

    return (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
            <p className="font-bold">Attention</p>
            <p>Un bloqueur de publicités a été détecté. Certaines fonctionnalités, notamment les paiements, pourraient ne pas fonctionner correctement. Veuillez désactiver votre bloqueur de publicités pour une expérience optimale.</p>
        </div>
    );
};

export default AdBlockWarning;