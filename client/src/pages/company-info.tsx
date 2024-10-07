import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/index';
import CompanyInfoForm from '@/components/customize/CompanyInfoForm';
import { CompanyInfo } from '@/types';
import usePersistedState from '@/contexts/usePersistedState';

export default function CompanyInfoPage() {
    const [hasVisitedRecap, setHasVisitedRecap] = usePersistedState<boolean>('hasVisitedRecap', false);
    const router = useRouter();

    const handleNextStep = (companyInfo: CompanyInfo) => {
        localStorage.setItem('companyInfo', JSON.stringify(companyInfo));
        setHasVisitedRecap(true);
        router.push('/recap-and-test');
    };

    useEffect(() => {
        const storedHasVisitedRecap = localStorage.getItem('hasVisitedRecap');
        if (storedHasVisitedRecap) {
            setHasVisitedRecap(JSON.parse(storedHasVisitedRecap));
        }
    }, []);

    return (
        <Layout title="Informations de l'entreprise">
            <div className="container mx-auto px-4 pb-12">
                <h1 className="text-3xl font-bold mb-8 text-center">Entrez les informations de votre entreprise</h1>
                <CompanyInfoForm onNextStep={handleNextStep} hasVisitedRecap={hasVisitedRecap} />
            </div>
        </Layout>
    );
}