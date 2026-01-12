import React from 'react';
import logoSrc from '../assets/logo.svg';

const Logo = ({ className }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <img
                src={logoSrc}
                alt="Sigong Plan Logo"
                className="w-auto h-[72px] md:h-[84px]"
            />
        </div>
    );
};

export default Logo;
