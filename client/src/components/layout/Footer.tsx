'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';

const Footer: React.FC = () => {
    const [email, setEmail] = useState('');
    const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Logique d'abonnement à la newsletter
        console.log('Email soumis:', email);
        setEmail('');
    };

    const navItems = [
        { name: 'Accueil', href: '/' },
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Créer', href: '/customize' },
        { name: 'Profil', href: '/profile' },
    ];

    const socialIcons = [
        { Icon: Facebook, name: 'Facebook' },
        { Icon: Twitter, name: 'Twitter' },
        { Icon: Instagram, name: 'Instagram' },
        { Icon: Linkedin, name: 'LinkedIn' },
    ];

    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div>
                        <motion.h3
                            className="text-2xl font-bold mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            Aliatech
                        </motion.h3>
                        <p className="text-gray-300">Créez votre chatbot personnalisé avec Aliatech</p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Liens Rapides</h4>
                        <ul className="space-y-2">
                            {navItems.map((item) => (
                                <motion.li
                                    key={item.name}
                                    whileHover={{ x: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link href={item.href} className="text-gray-300 hover:text-white transition">
                                        {item.name}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Suivez-nous</h4>
                        <div className="flex space-x-4">
                            {socialIcons.map(({ Icon, name }) => (
                                <motion.div
                                    key={name}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onHoverStart={() => setHoveredIcon(name)}
                                    onHoverEnd={() => setHoveredIcon(null)}
                                >
                                    <Icon size={24} className="text-gray-300 hover:text-white cursor-pointer" />
                                    <AnimatePresence>
                                        {hoveredIcon === name && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute mt-1 px-2 py-1 bg-blue-600 text-white text-xs rounded"
                                            >
                                                {name}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Votre email"
                                className="bg-gray-800 text-white px-4 py-2 rounded-t-md sm:rounded-l-md sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                                required
                            />
                            <motion.button
                                type="submit"
                                className="bg-blue-600 px-4 py-2 rounded-b-md sm:rounded-r-md sm:rounded-l-none hover:bg-blue-700 transition mt-2 sm:mt-0"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                S'abonner
                            </motion.button>
                        </form>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-800 text-center">
                    <p className="text-gray-400">
                        © {new Date().getFullYear()} Chatbot Aliatech. Tous droits réservés.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;