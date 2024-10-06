import { useState } from 'react';
import Layout from '@/components/layout/index';
import TutorialComponent from '@/components/support/TutorialComponent';
import DocumentationComponent from '@/components/support/DocumentationComponent';
import SupportComponent from '@/components/support/SupportComponent';

type ContentType = 'tutorial' | 'documentation' | 'support';

export default function Tutorial() {
    const [activeContent, setActiveContent] = useState<ContentType>('tutorial');

    return (
        <Layout title="Tutoriel et Assistance">
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8 text-center">Mise en place de votre chatbot</h1>
                <p className="text-center mb-8">
                    Choisissez l'option qui vous convient le mieux pour intégrer votre chatbot sur votre site web.
                </p>

                <div className="flex justify-center space-x-4 mb-8">
                    <button
                        onClick={() => setActiveContent('tutorial')}
                        className={`px-4 py-2 rounded ${activeContent === 'tutorial' ? 'bg-primary text-white' : 'bg-gray-200'}`}
                    >
                        Tutoriel gratuit
                    </button>
                    <button
                        onClick={() => setActiveContent('documentation')}
                        className={`px-4 py-2 rounded ${activeContent === 'documentation' ? 'bg-primary text-white' : 'bg-gray-200'}`}
                    >
                        Documentation
                    </button>
                    <button
                        onClick={() => setActiveContent('support')}
                        className={`px-4 py-2 rounded ${activeContent === 'support' ? 'bg-primary text-white' : 'bg-gray-200'}`}
                    >
                        Assistance payante
                    </button>
                </div>

                {activeContent === 'tutorial' && <TutorialComponent />}
                {activeContent === 'documentation' && <DocumentationComponent />}
                {activeContent === 'support' && <SupportComponent />}
            </div>
        </Layout>
    );
}