import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Layout from '@/components/layout/index';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import CallToAction from '@/components/home/CallToAction';

const DynamicTestimonials = dynamic(() => import('@/components/home/Testimonials'), { ssr: false });
const DynamicFAQ = dynamic(() => import('@/components/home/FAQ'), { ssr: false });

export default function Home() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <Layout>
            <Hero />
            <Features />
            {isClient && (
                <>
                    <DynamicTestimonials />
                    <CallToAction />
                    <DynamicFAQ />
                </>
            )}
        </Layout>
    );
}