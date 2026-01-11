import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import aboutImage from '../assets/interior_detail_wood_1768042299726.png'; // Assuming filename

const About = () => {
    const { t } = useLanguage();

    return (
        <section id="about" className="py-24 bg-[#F9F9F9]">
            <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                <div className="relative order-2 md:order-1">
                    <img src={aboutImage} alt="Wood Detail" className="w-full h-[500px] object-cover" />
                    <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-[var(--color-secondary)] -z-10 hidden md:block"></div>
                </div>

                <div className="order-1 md:order-2">
                    <span className="block text-[var(--color-secondary)] font-bold tracking-widest text-sm mb-4 uppercase">Si-Gong Plan</span>
                    <h2 className="text-3xl md:text-5xl mb-8 leading-tight font-bold">{t.about.title}</h2>
                    <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                        {t.about.desc}
                    </p>
                    <div className="w-20 h-1 bg-black mb-8"></div>
                </div>
            </div>
        </section>
    );
};

export default About;
