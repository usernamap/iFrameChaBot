import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

const Navbar: React.FC = () => {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = useAuth();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    const navItems = [
        { name: 'Accueil', href: '/' },
        { name: 'Créer', href: '/customize' },
        ...(user ? [
            { name: 'Dashboard', href: '/dashboard' },
            { name: 'Profil', href: '/profile' },
        ] : []),
    ];

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <motion.header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <motion.div
                        className="flex items-center text-2xl font-bold"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link href="/" className={`flex items-center ${isScrolled ? 'text-gray-800' : 'text-gray-900'}`}>
                            <Image
                                src="/logo.svg"
                                alt="Aliatech Logo"
                                width={40}
                                height={40}
                                className="h-10 w-auto"
                            />
                            <span className="ml-2">Aliatech</span>
                        </Link>
                    </motion.div>
                    <nav className="hidden md:block">
                        <ul className="flex space-x-8">
                            {navItems.map((item) => (
                                <motion.li key={item.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link
                                        href={item.href}
                                        className={`text-sm font-medium ${isScrolled ? 'text-gray-800 hover:text-blue-600' : 'text-gray-900 hover:text-blue-200'}`}
                                    >
                                        {item.name}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </nav>
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className={`p-2 rounded-md ${isScrolled ? 'text-gray-800' : 'text-gray-900'}`}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>
            {isMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="md:hidden bg-white shadow-lg"
                >
                    <ul className="py-2">
                        {navItems.map((item) => (
                            <motion.li
                                key={item.name}
                                whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href={item.href}
                                    className="block px-4 py-2 text-gray-900 hover:text-blue-600"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>
            )}
        </motion.header>
    );
};

export default Navbar;