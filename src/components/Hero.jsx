import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import heroImage from "../assets/hero_living_room_modern.png"; // Assuming filename

const Hero = () => {
    const { t } = useLanguage();

    return (
        <section id="hero" className="relative min-h-screen md:h-screen md:min-h-[700px] flex items-center bg-[#F5F0EB] pt-24 pb-16 md:py-0">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-[40%_60%] gap-8 md:gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="z-10 order-2 md:order-1"
                >
                    <h1 className={`text-3xl md:text-5xl mb-8 leading-tight text-[#1A1A1A] ${(typeof t.hero.title === 'string' && t.hero.title.charCodeAt(0) < 128) || (typeof t.hero.title === 'object' && t.hero.title.display.charCodeAt(0) < 128) ? 'hero-title-styled' : ''}`}>
                        {typeof t.hero.title === 'object' ? (
                            <>
                                <span className="sr-only">{t.hero.title.seo}</span>
                                <span aria-hidden="true">{t.hero.title.display}</span>
                            </>
                        ) : (
                            t.hero.title
                        )}
                    </h1>

                    <p className="text-xl text-gray-600 mb-4 max-w-md leading-snug">
                        {t.hero.subtitle}
                    </p>

                    {/* Description Points (Conditionally Rendered) */}
                    {t.hero.points && (
                        <ul className="space-y-1 mb-10 text-gray-700 ml-6">
                            {t.hero.points.map((point, index) => (
                                <li key={index} className="flex items-start gap-3 text-base">
                                    <span className="w-1.5 h-1.5 bg-[var(--color-secondary)] rounded-full mt-2.5 flex-shrink-0" />
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    )}


                    <a
                        href="#contact"
                        className="inline-block bg-[#1A1A1A] text-white px-8 py-3 rounded-full hover:bg-[var(--color-secondary)] transition-colors duration-300"
                    >
                        {t.hero.cta}
                    </a>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative h-[300px] md:h-[500px] w-full order-1 md:order-2"
                >
                    <div
                        className="w-full h-full rounded-xl shadow-[15px_15px_30px_rgba(0,0,0,0.25)] overflow-hidden"
                        style={{
                            maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent), linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)',
                            WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent), linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)',
                            maskComposite: 'intersect',
                            WebkitMaskComposite: 'source-in'
                        }}
                    >
                        <motion.img
                            src={heroImage}
                            alt="Modern Interior"
                            className="w-full h-full object-cover"
                            animate={{ scale: [1.1, 1.35] }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "easeInOut"
                            }}
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
