import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
    const { t } = useLanguage();
    const [status, setStatus] = useState(''); // '', 'submitting', 'success', 'error'

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;

        // Formspree ID from user provided image - CORRECT ID
        const FORM_ID = 'xdakqwno';
        // -----------------------------------------------------

        setStatus('submitting');

        const data = new FormData(form);

        try {
            const response = await fetch(`https://formspree.io/f/${FORM_ID}`, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                setStatus('success');
                form.reset();
                // Optional: Clear success message after a few seconds
                // setTimeout(() => setStatus(''), 5000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <section id="contact" className="bg-[#1A1A1A] text-white pt-24 pb-24">
            <div className="container mx-auto px-6 mb-20">
                <div className="max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-20">{t.contact.title}</h2>

                    {/* Success Message - Shown ABOVE form, not replacing it */}
                    {status === 'success' && (
                        <div className="bg-green-500/10 border border-green-500 text-green-500 p-6 rounded-lg text-center mb-8 animate-fade-in">
                            <h3 className="text-xl font-bold mb-2">{t.contact.successTitle}</h3>
                            <p>{t.contact.successMessage}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">{t.contact.name}</label>
                                <input required name="name" type="text" className="w-full bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:border-[var(--color-secondary)] transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">{t.contact.email}</label>
                                <input required name="email" type="email" className="w-full bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:border-[var(--color-secondary)] transition-colors" />
                            </div>
                        </div>

                        {/* Category Dropdown */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">{t.contact.category}</label>
                            <div className="relative">
                                <select name="category" className="w-full bg-white/5 border border-white/10 p-4 text-white appearance-none focus:outline-none focus:border-[var(--color-secondary)] transition-colors cursor-pointer">
                                    <option value="kitchen" className="bg-[#1A1A1A]">{t.contact.options.kitchen}</option>
                                    <option value="bathroom" className="bg-[#1A1A1A]">{t.contact.options.bathroom}</option>
                                    <option value="flooring" className="bg-[#1A1A1A]">{t.contact.options.flooring}</option>
                                    <option value="other" className="bg-[#1A1A1A]">{t.contact.options.other}</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">{t.contact.message}</label>
                            <textarea required name="message" rows="4" className="w-full bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:border-[var(--color-secondary)] transition-colors"></textarea>
                        </div>

                        <button type="submit" disabled={status === 'submitting'} className="w-full bg-[var(--color-secondary)] text-white px-8 py-4 hover:bg-white hover:text-[#1A1A1A] transition-colors duration-300 uppercase font-bold tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                            {status === 'submitting' ? 'Sending...' : t.contact.send}
                        </button>

                        {status === 'error' && (
                            <p className="text-red-500 text-sm mt-2">Something went wrong. Please try again later.</p>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
