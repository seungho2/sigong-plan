import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Instagram, Mail, Facebook, MapPin } from 'lucide-react';


const Footer = () => {
    const { t } = useLanguage();

    return (
        <footer className="bg-[#E5E5E5] text-[#1A1A1A] py-10">
            {/* Main Grid - Now 3 Columns */}
            <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8 text-sm mb-8">
                {/* Column 1: Brand */}
                <div className="flex flex-col items-start">
                    <h2 className="text-xl font-brand font-bold uppercase tracking-wide leading-none">SI-GONG PLAN</h2>
                    <div className="flex items-center gap-2">
                        <span className="italic font-brand text-gray-500 font-medium">Rénovation</span>
                        <div className="h-[2px] w-16 bg-gray-400"></div>
                    </div>
                </div>

                {/* Column 2: Location */}
                <div>
                    <h3 className="text-base font-bold mb-3">{t.footer.location}</h3>
                    <p className="text-[#1A1A1A] leading-relaxed flex items-center gap-2">
                        {t.footer.address}
                        <a
                            href="https://www.google.com/maps/search/?api=1&query=3404+Av.+Prud'homme,+Montréal,+QC+H4A+3H5"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-700 hover:text-[var(--color-secondary)] transition-colors"
                            aria-label="View on Google Maps"
                        >
                            <MapPin size={18} />
                        </a>
                    </p>
                </div>

                {/* Column 3: Contact INFO */}
                <div>
                    <h3 className="text-base font-bold mb-3">{t.footer.contactInfo}</h3>
                    <p className="text-[#1A1A1A] leading-relaxed">
                        {t.footer.phone}
                    </p>
                    <p className="text-[#1A1A1A] leading-relaxed">
                        {t.footer.email}
                    </p>
                </div>
            </div>

            {/* Bottom Line - Copyright & Social */}
            <div className="container mx-auto px-6 pt-6 border-t border-gray-300 text-xs text-gray-600 flex flex-col md:flex-row justify-between items-center gap-4">
                <p>{t.footer.copyright}</p>

                {/* Social Moved Logic */}
                <div className="flex items-center gap-4">
                    <span className="uppercase tracking-wide text-[10px]">{t.footer.social}</span>
                    <div className="flex gap-3">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-secondary)] transition-colors">
                            <Facebook size={18} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-secondary)] transition-colors">
                            <Instagram size={18} />
                        </a>
                        <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-secondary)] transition-colors" aria-label="Pinterest">
                            <div className="w-[18px] h-[18px] rounded-full border-2 border-current flex items-center justify-center text-[10px] font-bold">P</div>
                        </a>
                        <a href={`mailto:${t.footer.email}`} className="hover:text-[var(--color-secondary)] transition-colors">
                            <Mail size={18} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
