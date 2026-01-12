import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

import imgKitchen from '../assets/gallery_kitchen_1768241243685.png';
import imgBathroom from '../assets/gallery_bathroom_1768241258981.png';
import imgLiving from '../assets/gallery_living_1768241273472.png';
import imgBedroom from '../assets/gallery_bedroom_1768241287336.png';
import imgOffice from '../assets/gallery_office_1768241308447.png';
import imgDining from '../assets/gallery_dining_1768241320701.png';
import imgHallway from '../assets/gallery_hallway_1768241333727.png';
import imgStairs from '../assets/gallery_stairs_1768241347189.png';
import imgLaundry from '../assets/gallery_laundry.png';

const galleryImages = [
    { id: 1, src: imgKitchen, category: 'Kitchen', aspect: 'aspect-[3/4]' },
    { id: 2, src: imgStairs, category: 'Interior', aspect: 'aspect-[4/3]' },
    { id: 3, src: imgLiving, category: 'Living Room', aspect: 'aspect-square' },
    { id: 4, src: imgBathroom, category: 'Bathroom', aspect: 'aspect-[3/4]' },
    { id: 5, src: imgDining, category: 'Dining', aspect: 'aspect-[4/3]' },
    { id: 6, src: imgBedroom, category: 'Bedroom', aspect: 'aspect-square' },
    { id: 7, src: imgOffice, category: 'Office', aspect: 'aspect-[3/4]' },
    { id: 8, src: imgHallway, category: 'Entrance', aspect: 'aspect-[4/3]' },
    { id: 9, src: imgLaundry, category: 'Laundry Room', aspect: 'aspect-square' },
];

const Gallery = () => {
    const { t } = useLanguage();
    const [selectedImage, setSelectedImage] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    // Scroll Ref
    const scrollRef = useRef(null);
    const scrollInitialized = useRef(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Initialize Scroll Position to Middle
    useEffect(() => {
        if (scrollRef.current && !scrollInitialized.current) {
            // Wait for render
            setTimeout(() => {
                const { children } = scrollRef.current;
                if (children.length >= galleryImages.length * 3 + 1) {
                    const firstItem = children[1];
                    const secondSetFirstItem = children[1 + galleryImages.length];
                    if (firstItem && secondSetFirstItem) {
                        const oneSetWidth = secondSetFirstItem.offsetLeft - firstItem.offsetLeft;
                        scrollRef.current.scrollLeft = oneSetWidth;
                        scrollInitialized.current = true;
                    }
                }
            }, 100);
        }
    }, [galleryImages]);

    // Infinite Scroll Handler
    const handleScroll = () => {
        if (!scrollRef.current) return;

        const { scrollLeft, clientWidth, children } = scrollRef.current;
        // children[0] is style tag. children[1] is first image. children[1+galleryImages.length] is first image of second set.
        if (children.length < galleryImages.length * 3 + 1) return;

        const firstItem = children[1];
        const secondSetFirstItem = children[1 + galleryImages.length];

        if (!firstItem || !secondSetFirstItem) return;

        const oneSetWidth = secondSetFirstItem.offsetLeft - firstItem.offsetLeft;

        // Loop Logic: Teleport to middle set
        if (scrollLeft <= 50) {
            scrollRef.current.scrollLeft = scrollLeft + oneSetWidth;
        } else if (scrollLeft >= (oneSetWidth * 2) - clientWidth - 50) {
            scrollRef.current.scrollLeft = scrollLeft - oneSetWidth;
        }
    };

    // Button Scroll
    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -400 : 400;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section id="gallery" className="py-24 bg-white relative select-none">
            <div className="container mx-auto px-6 relative group">
                <div className="text-center mb-16">
                    <span className="block text-[var(--color-secondary)] font-bold tracking-widest text-sm mb-4 uppercase">
                        {t.gallery.subtitle}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-[#1A1A1A]">
                        {t.gallery.title}
                    </h2>
                    <div className="w-20 h-1 bg-black mx-auto mt-8"></div>
                </div>

                <div className="relative">
                    {/* Navigation Buttons (All Devices) */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 h-48 w-8 md:w-12 bg-white/10 hover:bg-white/20 rounded-r-2xl shadow-sm backdrop-blur-[2px] flex items-center justify-center transition-all active:scale-95 text-white border-r border-white/10 group-nav"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={isMobile ? 28 : 40} className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] opacity-80 group-nav-hover:opacity-100" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 h-48 w-8 md:w-12 bg-white/10 hover:bg-white/20 rounded-l-2xl shadow-sm backdrop-blur-[2px] flex items-center justify-center transition-all active:scale-95 text-white border-l border-white/10 group-nav"
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={isMobile ? 28 : 40} className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] opacity-80 group-nav-hover:opacity-100" />
                    </button>

                    {/* Scroll Container */}
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar px-4"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        onScroll={handleScroll}
                    >
                        <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>

                        {/* Infinite Loop: Triplicated Data */}
                        {[...galleryImages, ...galleryImages, ...galleryImages].map((image, index) => (
                            <motion.div
                                key={`${image.id}-${index}`}
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: (index % 9) * 0.1 }}
                                viewport={{ once: true }}
                                className={`relative group rounded-2xl overflow-hidden flex-none h-[400px] md:h-[500px] snap-center ${image.aspect}`}
                                onClick={() => setSelectedImage(image)}
                            >
                                <div className="w-full h-full overflow-hidden">
                                    <motion.img
                                        src={image.src}
                                        alt={image.category}
                                        className="w-full h-full object-cover"
                                        // Breathing Animation: Universal
                                        animate={{ scale: [1, 1.15] }}
                                        transition={{
                                            duration: 4 + (index % 3),
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                            ease: "easeInOut",
                                            delay: index * 0.2
                                        }}
                                    />
                                </div>

                                {/* Overlay */}
                                <div
                                    className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 bg-black/40 text-white
                                        ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                                    `}
                                >
                                    <ZoomIn size={32} className="mb-2" />
                                    <span className="font-medium tracking-wider uppercase text-sm">
                                        {t.gallery.viewProject}
                                    </span>
                                    <span className="text-xs opacity-75 mt-1">{image.category}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            className="absolute top-6 right-6 text-white hover:text-[var(--color-secondary)] transition-colors"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X size={32} />
                        </button>
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            src={selectedImage.src}
                            alt={selectedImage.category}
                            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Gallery;
