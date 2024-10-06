import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/index';
import CompanyInfoForm from '@/components/customize/CompanyInfoForm';

export default function CompanyInfo() {
    const router = useRouter();

    const handleNextStep = (companyInfo: any) => {
        // Sauvegarder les informations de l'entreprise et passer à l'étape suivante
        localStorage.setItem('companyInfo', JSON.stringify(companyInfo));
        router.push('/recap-and-test');
    };

    return (
        <Layout title="Informations de l'entreprise">
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8 text-center">Entrez les informations de votre entreprise/activité</h1>
                <CompanyInfoForm onNextStep={handleNextStep} />
            </div>
        </Layout>
    );
}