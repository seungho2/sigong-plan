// This tool call is for updating code, but I need to copy file first.
// I'll skip this tool call and use run_command first.
// Actually I can't start with run_command if I declared I'm using replace_file_content... 
// Wait, I can just do the copy in the next turn or cancels this?
// I will use `basicServiceImage` import line but the file won't exist yet, so it might fail build.
// Best to copy first. I'll execute a null op or just proceed with run_command ?
// I'll chain them.
// Wait, `replace_file_content` will be processed.
// I will cancel this tool call by not outputting anything? No, that's not possible.
// I will just perform the import update, and concurrently copy the file.
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Hammer, Ruler, Building2, ArrowRight } from 'lucide-react';
import ServiceModal from './ServiceModal';
import aboutImage from '../assets/interior_detail_wood_1768042299726.png'; // Placeholder image
import serviceBasicImage from '../assets/service_basic_repair.png'; // New repair image
import serviceIntermediateImage from '../assets/service_intermediate_sink.png'; // New sink install image
import serviceAdvancedImage from '../assets/service_advanced_design.png'; // New design image

const Services = () => {
    const { t } = useLanguage();
    const [selectedService, setSelectedService] = useState(null);

    const serviceData = [
        {
            id: 'basic',
            icon: <Hammer size={32} />,
            content: {
                ...t.services.basic,
                // Image for demo
                image: serviceBasicImage
            }
        },
        {
            id: 'intermediate',
            icon: <Ruler size={32} />,
            content: {
                ...t.services.intermediate,
                image: serviceIntermediateImage
            }
        },
        {
            id: 'advanced',
            icon: <Building2 size={32} />,
            content: {
                ...t.services.advanced,
                image: serviceAdvancedImage
            }
        }
    ];

    const handleServiceClick = (service) => {
        // Allow all modals
        if (service.id === 'basic' || service.id === 'intermediate' || service.id === 'advanced') {
            setSelectedService(service.content);
        }
    };

    return (
        <section id="services" className="py-24 bg-[#F5F5F5]">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-[var(--color-secondary)] font-bold tracking-widest text-sm uppercase block mb-4">
                        {t.services.subtitle}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold mb-8 text-gray-900 leading-tight">
                        {t.services.title}
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                        {t.services.intro}
                    </p>
                    <div className="w-20 h-1 bg-black mx-auto"></div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {serviceData.map((item, index) => (
                        <div key={item.id} className="group relative p-8 border border-gray-200 hover:border-[var(--color-secondary)] transition-all duration-300 bg-white hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded-2xl">
                            <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-6xl text-gray-400 group-hover:text-[var(--color-secondary)] transition-colors select-none">
                                0{index + 1}
                            </div>
                            <div className="mb-6 text-[var(--color-text)] group-hover:text-[var(--color-secondary)] transition-colors relative z-10">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4 relative z-10">{item.content.title}</h3>
                            <p className="text-gray-600 mb-8 leading-relaxed min-h-[80px] relative z-10">
                                {item.content.desc}
                            </p>
                            <button
                                onClick={() => handleServiceClick(item)}
                                className={`relative z-10 inline-flex items-center gap-2 px-6 py-3 border border-black text-black text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-secondary)] hover:border-[var(--color-secondary)] hover:text-white transition-all duration-300 cursor-pointer`}
                            >
                                {t.services.btn} <ArrowRight size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <ServiceModal
                isOpen={!!selectedService}
                onClose={() => setSelectedService(null)}
                service={selectedService}
            />
        </section>
    );
};

export default Services;
