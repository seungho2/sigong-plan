import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Hammer, Ruler, Building2, ArrowRight } from 'lucide-react';

const Services = () => {
    const { t } = useLanguage();

    const serviceData = [
        {
            id: 'basic',
            icon: <Hammer size={32} />,
            content: t.services.basic
        },
        {
            id: 'intermediate',
            icon: <Ruler size={32} />,
            content: t.services.intermediate
        },
        {
            id: 'advanced',
            icon: <Building2 size={32} />,
            content: t.services.advanced
        }
    ];

    return (
        <section id="services" className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl md:text-4xl mb-16 text-center">{t.services.title}</h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {serviceData.map((item) => (
                        <div key={item.id} className="group p-8 border border-gray-100 hover:border-[var(--color-secondary)] transition-all duration-300 hover:shadow-lg bg-[#FAFAFA] hover:bg-white rounded-sm">
                            <div className="mb-6 text-[var(--color-text)] group-hover:text-[var(--color-secondary)] transition-colors">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4">{item.content.title}</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed min-h-[80px]">
                                {item.content.desc}
                            </p>
                            <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider group-hover:gap-3 transition-all">
                                {t.services.btn} <ArrowRight size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
