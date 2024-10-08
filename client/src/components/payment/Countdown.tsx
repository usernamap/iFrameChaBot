import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CountdownComponent = () => {
    const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        // Fonction pour obtenir le temps restant depuis l'API
        const fetchCountdown = async () => {
            try {
                const response = await axios.get('http://localhost:3002/api/countdown');
                if (response.data) {
                    setCountdown({
                        hours: response.data.hours,
                        minutes: response.data.minutes,
                        seconds: response.data.seconds
                    });
                }
            } catch (error) {
                console.error('Error fetching countdown:', error);
            }
        };

        // Récupération régulière du temps restant toutes les secondes
        const interval = setInterval(() => {
            fetchCountdown();
        }, 1000);

        // Nettoyage lors de la désactivation du composant
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <p>
                Temps restant : {countdown.hours.toString().padStart(2, '0')}:
                {countdown.minutes.toString().padStart(2, '0')}:
                {countdown.seconds.toString().padStart(2, '0')}
            </p>
        </div>
    );
};

export default CountdownComponent;
