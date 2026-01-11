import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import heroImage from '../assets/interior_living_room_1768042288310.png'; // Assuming filename

const Hero = () => {
    const { t } = useLanguage();

    return (
        <section id="hero" className="relative h-screen min-h-[700px] flex items-center bg-[#F5F0EB]">
            <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center pt-32 md:pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="z-10"
                >
                    <h1 className="text-3xl md:text-6xl mb-6 leading-tight text-[#1A1A1A]">
                        {t.hero.title}
                    </h1>

                    <p className="text-lg text-gray-600 mb-8 max-w-md leading-relaxed">
                        {t.hero.subtitle}
                    </p>
                    <button className="bg-[#1A1A1A] text-white px-8 py-3 rounded-full hover:bg-[var(--color-secondary)] transition-colors duration-300">
                        {t.hero.cta}
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative h-[500px] w-full"
                >
                    <img
                        src={heroImage}
                        alt="Modern Interior"
                        className="w-full h-full object-cover rounded shadow-2xl"
                    />
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
