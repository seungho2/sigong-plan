import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = 'G-22VFJGLBZV';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { language } = useLanguage();

    const content = {
        fr: {
            title: "Respect de votre vie privée",
            text: "Nous utilisons des témoins (cookies) pour analyser notre trafic et améliorer votre expérience.",
            accept: "Accepter",
            decline: "Refuser"
        },
        en: {
            title: "We respect your privacy",
            text: "We use cookies to analyze our traffic and improve your experience.",
            accept: "Accept",
            decline: "Decline"
        },
        ko: {
            title: "개인정보 보호",
            text: "웹사이트 트래픽 분석 및 사용자 경험 개선을 위해 쿠키를 사용합니다.",
            accept: "동의",
            decline: "거절"
        }
    };

    const t = content[language] || content.en;

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('cookie_consent');

        if (consent === null) {
            // No choice made yet, show banner
            setIsVisible(true);
        } else if (consent === 'true') {
            // Already consented, initialize GA
            initGA();
        }
        // If 'false', do nothing
    }, []);

    const initGA = () => {
        // Prevent multiple initializations
        if (window.gtag) return;

        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        script.async = true;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', GA_MEASUREMENT_ID);
    };

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'true');
        setIsVisible(false);
        initGA();
    };

    const handleDecline = () => {
        localStorage.setItem('cookie_consent', 'false');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-black/95 border-t border-secondary/30 backdrop-blur-sm shadow-2xl animate-fade-in-up">
            <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">

                {/* Text Content */}
                <div className="text-gray-300 text-sm md:text-base text-center md:text-left">
                    <p className="mb-1 text-secondary font-medium">
                        {t.title}
                    </p>
                    <p>
                        {t.text}
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 shrink-0">
                    <button
                        onClick={handleDecline}
                        className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors border border-gray-700 rounded hover:border-gray-500"
                    >
                        {t.decline}
                    </button>
                    <button
                        onClick={handleAccept}
                        className="px-6 py-2 text-sm font-medium bg-secondary text-black rounded hover:bg-yellow-500 transition-colors shadow-lg shadow-secondary/20 font-bold"
                    >
                        {t.accept}
                    </button>
                </div>
            </div>
        </div>
    );
};


export default CookieConsent;
