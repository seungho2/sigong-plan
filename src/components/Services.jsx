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
                image: aboutImage, // Placeholder
                detailedDesc: "Ready for a change? Our Intermediate Service focuses on aesthetic updates and functional improvements that refresh your space without major structural work.",
                features: [
                    "Flooring installation (laminate, vinyl, tile)",
                    "Cabinet refacing and hardware updates",
                    "Full room painting and wallpaper installation",
                    "Backsplash installation",
                    "Custom shelving solutions"
                ]
            }
        },
        {
            id: 'advanced',
            icon: <Building2 size={32} />,
            content: {
                ...t.services.advanced,
                image: aboutImage, // Placeholder
                detailedDesc: "Transform your vision into reality. Our Advanced Service covers comprehensive remodeling projects involving structural changes, plumbing, and electrical work.",
                features: [
                    "Complete kitchen and bathroom remodels",
                    "Structural wall removal and open concept layout",
                    "Basement finishing and waterproofing",
                    "Electrical and plumbing system upgrades",
                    "Project management from design to completion"
                ]
            }
        }
    ];

    const handleServiceClick = (service) => {
        // Only open modal for 'basic' for now as requested, or generally for all. 
        // User asked: "기본서비스에만 붙여줘" (Attach only to Basic Service).
        if (service.id === 'basic') {
            setSelectedService(service.content);
        } else {
            // For now do nothing or standard behavior?
            // "기본서비스에만 붙여줘" implies others might not need it yet.
            // But to show it works, I'll allow clicking on Basic.
        }
    };

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
                            <button
                                onClick={() => handleServiceClick(item)}
                                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#1A1A1A] text-[#1A1A1A] text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-secondary)] hover:border-[var(--color-secondary)] hover:text-white transition-all duration-300 ${item.id === 'basic' ? 'cursor-pointer' : 'cursor-default opacity-30 hover:bg-transparent hover:text-[#1A1A1A] hover:border-[#1A1A1A]'}`}
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
