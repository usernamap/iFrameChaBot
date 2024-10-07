import React, { useState } from 'react';
import Layout from '@/components/layout/index';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '@/components/common/Icons';

const MentionsLegales: React.FC = () => {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const sections = [
        {
            id: 'informations-legales',
            title: 'Informations légales',
            content: (
                <>
                    <p><strong>Nom de la société :</strong> Aliatech</p>
                    <p><strong>Siège social :</strong> 60 rue François 1er - 75008 Paris</p>
                    <p><strong>Email :</strong> contact@aliatech.fr</p>
                    <p><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
                </>
            )
        },
        {
            id: 'collecte-donnees',
            title: 'Collecte et utilisation des données',
            content: (
                <>
                    <p>Les informations collectées via notre formulaire de création de chatbot sont utilisées uniquement dans le but de personnaliser et d'optimiser votre assistant virtuel.</p>
                    <p className='my-2'> Nous ne vendons ni ne partageons ces informations avec des tiers. </p>
                    <p>Toutes les données sont stockées de manière sécurisée et sont chiffrées pour garantir leur confidentialité.</p>
                </>
            )
        },
        {
            id: 'droits-utilisateurs',
            title: 'Droits des utilisateurs',
            content: (
                <>
                    <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants concernant vos données personnelles :</p>
                    <ul className="list-disc pl-5 mt-2">
                        <li>Droit d'accès</li>
                        <li>Droit de rectification</li>
                        <li>Droit à l'effacement ('droit à l'oubli')</li>
                        <li>Droit à la limitation du traitement</li>
                        <li>Droit à la portabilité des données</li>
                        <li>Droit d'opposition</li>
                    </ul>
                    <p className="mt-2">Pour exercer ces droits, veuillez nous contacter à privacy@aliatech.fr.</p>
                </>
            )
        },
        // {
        //     id: 'cookies',
        //     title: 'Cookies',
        //     content: (
        //         <>
        //             <p>Notre site utilise des cookies pour améliorer l'expérience utilisateur. Les types de cookies que nous utilisons incluent :</p>
        //             <ul className="list-disc pl-5 mt-2">
        //                 <li>Cookies essentiels : nécessaires au fonctionnement du site</li>
        //                 <li>Cookies analytiques : pour comprendre comment le site est utilisé</li>
        //                 <li>Cookies de préférences : pour mémoriser vos choix</li>
        //             </ul>
        //             <p className="mt-2">En utilisant notre site, vous acceptez l'utilisation de ces cookies conformément à notre politique de confidentialité.</p>
        //         </>
        //     )
        // },
        {
            id: 'propriete-intellectuelle',
            title: 'Propriété intellectuelle',
            content: (
                <>
                    <p>Tout le contenu présent sur ce site (textes, images, logos, code source, etc.) est la propriété exclusive d'Aliatech et est protégé par les lois sur la propriété intellectuelle.</p>
                    <p className='mt-2'> Toute reproduction, distribution ou utilisation non autorisée de ce contenu est strictement interdite et peut faire l'objet de poursuites judiciaires.</p>
                </>
            )
        },
        {
            id: 'responsabilite',
            title: 'Responsabilité',
            content: (
                <>
                    <p>Aliatech ne saurait être tenu responsable des dommages directs ou indirects, matériels ou immatériels, résultant de l'accès au site ou de son utilisation.</p>
                    <p className='mt-2'> Aliatech ne garantit pas l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur ce site.</p>
                </>
            )
        },
        {
            id: 'hebergement',
            title: 'Hébergement',
            content: (
                <>
                    <p><strong>Nom de l'hébergeur :</strong> OVH SAS</p>
                    <p><strong>Adresse :</strong> 2 rue Kellermann - 59100 Roubaix - France</p>
                    <p><strong>Téléphone :</strong> +33 9 72 10 10 07</p>
                    <p>Les serveurs d'hébergement sont situés en France et bénéficient de toutes les mesures de sécurité nécessaires pour garantir la confidentialité des données.</p>
                </>
            )
        },
    ];

    return (
        <Layout title="Mentions légales">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 text-center text-primary">Mentions légales</h1>

                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    {sections.map((section) => (
                        <div key={section.id} className="border-b border-gray-200 last:border-b-0">
                            <motion.button
                                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                                onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                            >
                                <span className="text-xl font-semibold">{section.title}</span>
                                <motion.span
                                    animate={{ rotate: activeSection === section.id ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Icons.ChevronDown />
                                </motion.span>
                            </motion.button>
                            <AnimatePresence>
                                {activeSection === section.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="px-6 py-4 bg-gray-50"
                                    >
                                        {section.content}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <Link href="/company-info" passHref>
                        <motion.button
                            className="bg-primary text-white px-8 py-3 rounded-full hover:bg-primary-dark transition-colors inline-flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Icons.ArrowLeft />
                            Retour au formulaire
                        </motion.button>
                    </Link>
                </div>
            </div>
        </Layout>
    );
};

export default MentionsLegales;