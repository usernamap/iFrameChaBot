import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
    id: number;
    name: string;
    company: string;
    comment: string;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: "Sophie Martin",
        company: "E-commerce Solutions",
        comment: "Grâce à l'assistant IA d'Aliatech, notre service client est passé au niveau supérieur. Nos clients sont ravis de l'efficacité et de la rapidité des réponses !",
    },
    {
        id: 2,
        name: "Thomas Dubois",
        company: "Tech Innovators",
        comment: "La personnalisation de notre chatbot a été un jeu d'enfant. Il s'intègre parfaitement à notre site et reflète vraiment l'identité de notre marque.",
    },
    {
        id: 3,
        name: "Emma Leroy",
        company: "Startup Visionary",
        comment: "Aliatech nous a permis d'offrir un support 24/7 sans augmenter nos coûts. C'est un véritable atout pour notre croissance !",
    }
];

const Testimonials: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextTestimonial = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <section className="bg-gray-100 py-20">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Ce que nos clients disent</h2>
                <div className="relative max-w-4xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white p-8 rounded-lg shadow-lg"
                        >
                            <Quote className="text-primary w-12 h-12 mb-4" />
                            <p className="text-xl mb-6">{testimonials[currentIndex].comment}</p>
                            <div className="flex items-center">
                                <div>
                                    <p className="font-bold">{testimonials[currentIndex].name}</p>
                                    <p className="text-gray-600">{testimonials[currentIndex].company}</p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                    <button
                        onClick={prevTestimonial}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-12 bg-white p-2 rounded-full shadow-md"
                    >
                        <ChevronLeft className="text-primary" />
                    </button>
                    <button
                        onClick={nextTestimonial}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-12 bg-white p-2 rounded-full shadow-md"
                    >
                        <ChevronRight className="text-primary" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;