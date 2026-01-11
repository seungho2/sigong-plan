import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';

const ServiceModal = ({ isOpen, onClose, service }) => {
    if (!isOpen || !service) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden relative"
                >
                    {/* Image Section */}
                    <div className="h-48 bg-gray-200 relative">
                        <img
                            src={service.image}
                            alt={service.title}
                            className="w-full h-full object-cover"
                        />
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white rounded-full transition-colors"
                        >
                            <X size={20} className="text-gray-800" />
                        </button>
                    </div>

                    {/* Content Section */}
                    <div className="p-8">
                        <span className="text-[var(--color-secondary)] text-sm font-bold uppercase tracking-wider mb-2 block">
                            Service Detail
                        </span>
                        <h3 className="text-2xl font-bold mb-4 text-[#1A1A1A]">{service.title}</h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            {service.detailedDesc}
                        </p>

                        {/* List of features */}
                        <div className="space-y-3 mb-8">
                            {service.features.map((feature, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <CheckCircle2 size={18} className="text-[var(--color-secondary)] mt-1 flex-shrink-0" />
                                    <span className="text-gray-700 text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>

                        {/* Action To Close or Contact */}
                        <div className="flex gap-4">
                            <a href="#contact" onClick={onClose} className="flex-1 bg-[#1A1A1A] text-white text-center py-3 rounded-full font-medium hover:bg-[var(--color-secondary)] transition-colors">
                                Inquire Now
                            </a>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ServiceModal;
