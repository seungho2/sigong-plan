import React, { createContext, useState, useContext } from 'react';
import { translations } from '../translations/data';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('ko')) return 'ko';
        if (browserLang.startsWith('fr')) return 'fr';
        return 'en'; // Default fallback
    });

    const t = translations[language];

    const switchLanguage = (lang) => {
        if (translations[lang]) {
            setLanguage(lang);
        }
    };

    return (
        <LanguageContext.Provider value={{ language, switchLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
