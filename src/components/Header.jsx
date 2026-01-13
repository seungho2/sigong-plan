import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X, Globe } from 'lucide-react';
import Logo from './Logo';

const Header = () => {
    const { t, switchLanguage, language } = useLanguage();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);

            // Scroll Spy Logic
            const sections = ['hero', 'about', 'services', 'gallery', 'contact'];
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
        `text-xl font-medium transition-colors ${activeSection === section ? 'text-[var(--color-secondary)] font-bold' : 'text-gray-700 hover:text-[var(--color-secondary)]'}`;

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'}`}>
            {/* Desktop License Info Row - Reordered to Top */}
            <div className="hidden md:flex container mx-auto justify-end px-10 gap-3 text-xs text-gray-800 mb-2">
                <span className="flex items-center">
                    <span className="w-1 h-1 bg-gray-500 rounded-full mr-1.5"></span>
                    <span className="font-bold">RBQ <span className="font-normal font-mono ml-1">5811-9603-01</span></span>
                </span>
                <span className="flex items-center">
                    <span className="w-1 h-1 bg-gray-500 rounded-full mr-1.5"></span>
                    <span className="font-bold">CCQ <span className="font-normal font-mono ml-1">909-980</span></span>
                </span>
                <span className="flex items-center">
                    <span className="w-1 h-1 bg-gray-500 rounded-full mr-1.5"></span>
                    <span className="font-bold">QCCQ</span>
                </span>
                <span className="flex items-center">
                    <span className="w-1 h-1 bg-gray-500 rounded-full mr-1.5"></span>
                    <span className="font-bold">APCHQ <span className="font-normal font-mono ml-1">917984-04</span></span>
                </span>
            </div>

            <div className="container mx-auto pl-6 pr-10 flex items-center">
                {/* Logo */}
                <div className="flex items-center mr-12">
                    <a href="#hero" className="block cursor-pointer">
                        <Logo />
                    </a>
                </div>

                {/* Desktop Nav - Right Aligned */}
                <nav className="hidden md:flex items-center gap-8 ml-auto mr-8">
                    <a href="#hero" className={navLinkClass('hero')}>{t.nav.home}</a>
                    <a href="#about" className={navLinkClass('about')}>{t.nav.about}</a>
                    <a href="#services" className={navLinkClass('services')}>{t.nav.services}</a>
                    <a href="#gallery" className={navLinkClass('gallery')}>{t.nav.gallery}</a>
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
                        <option value="ko">KR</option>
                    </select>
                </div>

                {/* Mobile Menu Toggle */}
                {/* Mobile Menu Toggle */}
                <button className="md:hidden ml-4" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Desktop License Info Row - visible below main header logic if needed, or integrated. 
                User said "under the header menu". The menu is to the right. 
                I will put it in a separate row within the container if space allows? 
                Actually, putting it absolute positioned or in a separate flex row.
            */}


            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white shadow-lg p-6 flex flex-col gap-4 md:hidden">
                    <a href="#hero" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">{t.nav.home}</a>
                    <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">{t.nav.about}</a>
                    <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">{t.nav.services}</a>
                    <a href="#gallery" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">{t.nav.gallery}</a>
                    <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">{t.nav.contact}</a>

                </div>
            )}
        </header>
    );
};

export default Header;
