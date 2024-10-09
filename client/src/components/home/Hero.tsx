import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const content = (
        <section className="bg-gradient-to-r from-primary to-blue-600 py-20">
            <div className="container mx-auto px-4 text-center">
                {isMounted ? (
                    <>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-4xl font-bold text-white mb-6"
                        >
                            Un assistant intelligent pour votre entreprise
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-xl text-white mb-8"
                        >
                            Créez votre assistant IA personnalisé en quelques clics et transformez l'expérience de vos clients.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <Link href="/customize" className="inline-flex items-center bg-white text-primary font-bold py-3 px-6 rounded-full text-lg shadow-lg hover:bg-gray-100 transition duration-300">
                                Commencer maintenant
                                <ArrowRight className="ml-2" size={20} />
                            </Link>
                        </motion.div>
                    </>
                ) : (
                    <>
                        <h2 className="text-4xl font-bold text-white mb-6">
                            Prêt à révolutionner votre service client ?
                        </h2>
                        <p className="text-xl text-white mb-8">
                            Créez votre assistant IA personnalisé en quelques clics et transformez l'expérience de vos clients.
                        </p>
                        <div>
                            <Link href="/customize" className="inline-flex items-center bg-white text-primary font-bold py-3 px-6 rounded-full text-lg shadow-lg hover:bg-gray-100 transition duration-300 pulse-animation">
                                Commencer maintenant
                                <ArrowRight className="ml-2" size={20} />
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    );

    return content;
};

export default Hero;