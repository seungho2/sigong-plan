import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X, Globe } from 'lucide-react';
import logo from '../assets/logo_v7.png';

const Header = () => {
    const { t, switchLanguage, language } = useLanguage();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);

            // Scroll Spy Logic
            const sections = ['hero', 'services', 'about', 'contact'];
            let current = '';

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 150 && rect.bottom >= 150) {
                        current = section;
                        break;
                    }
                }
            }
            setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinkClass = (section) =>
        `text-base font-medium transition-colors ${activeSection === section ? 'text-[var(--color-secondary)] font-bold' : 'text-gray-700 hover:text-[var(--color-secondary)]'}`;

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto pl-6 pr-10 flex items-center">
                {/* Logo */}
                <div className="flex items-center gap-3 mr-12">
                    <img src={logo} alt="Si-Gong Plan Logo" className="h-16 w-auto object-contain" />
                </div>

                {/* Desktop Nav - Right Aligned */}
                <nav className="hidden md:flex items-center gap-8 ml-auto mr-8">
                    <a href="#hero" className={navLinkClass('hero')}>{t.nav.home}</a>
                    <a href="#services" className={navLinkClass('services')}>{t.nav.services}</a>
                    <a href="#about" className={navLinkClass('about')}>{t.nav.about}</a>
                    <a href="#contact" className={navLinkClass('contact')}>{t.nav.contact}</a>
                </nav>

                {/* Language Switcher */}
                {/* Language Switcher */}
                <div className="flex items-center gap-2 ml-auto md:ml-0 border-none md:border-l pl-0 md:pl-4 border-gray-300">
                    <Globe size={18} className="text-gray-500" />
                    <select
                        value={language}
                        onChange={(e) => switchLanguage(e.target.value)}
                        className="bg-transparent text-sm font-medium outline-none cursor-pointer border-none"
                    >
                        <option value="fr">FR</option>
                        <option value="en">EN</option>
                        <option value="kr">KR</option>
                    </select>
                </div>

                {/* Mobile Menu Toggle */}
                {/* Mobile Menu Toggle */}
                <button className="md:hidden ml-4" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white shadow-lg p-6 flex flex-col gap-4 md:hidden">
                    <a href="#hero" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">{t.nav.home}</a>
                    <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">{t.nav.services}</a>
                    <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">{t.nav.about}</a>
                    <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">{t.nav.contact}</a>

                </div>
            )}
        </header>
    );
};

export default Header;
