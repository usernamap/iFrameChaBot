import React from 'react';

const TutorialComponent: React.FC = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Tutoriel de mise en place</h2>
            <ol className="list-decimal list-inside space-y-4">
                <li>Copiez le code iframe généré pour votre chatbot.</li>
                <li>Ouvrez le fichier HTML de la page où vous souhaitez ajouter le chatbot.</li>
                <li>Collez le code iframe à l'endroit où vous voulez que le chatbot apparaisse.</li>
                <li>Sauvegardez le fichier et rechargez votre page web.</li>
                <li>Votre chatbot devrait maintenant être visible et fonctionnel sur votre site !</li>
            </ol>
            <p className="mt-4">
                Si vous rencontrez des difficultés, n'hésitez pas à consulter notre documentation détaillée ou à faire appel à notre service d'assistance.
            </p>
        </div>
    );
};

export default TutorialComponent;