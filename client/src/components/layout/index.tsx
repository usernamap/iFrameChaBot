import Head from 'next/head';
import Navbar from './Navbar';
import Footer from '@/components/layout/Footer';

interface LayoutProps {
    readonly children: React.ReactNode;
    readonly title?: string;
}

export default function Layout({ children, title = 'Chatbot Aliatech' }: LayoutProps) {
    return (
        <>
            <Head>
                <title>{`${title} | Aliatech`}</title>
                <meta name="description" content="Créez votre chatbot personnalisé avec Aliatech" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow pt-16">{children}</main>
                <Footer />
            </div>
        </>
    );
}