import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { db } from '../utils/firebase';
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

const Gallery = () => {
    const { t } = useLanguage();
    const [selectedImage, setSelectedImage] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [galleryImages, setGalleryImages] = useState([]);
    const [loading, setLoading] = useState(true);

    // Scroll Ref
    const scrollRef = useRef(null);
    const scrollInitialized = useRef(false);

    // Fetch Images from Firebase
    useEffect(() => {
        const fetchImages = async () => {
            try {
                // Optimized Query: Uses Composite Index (Visible + Date) for scalability
                const q = query(
                    collection(db, "gallery"),
                    where("isVisible", "==", true),
                    orderBy("date", "desc")
                );

                const querySnapshot = await getDocs(q);
                console.log(`Gallery: Fetched ${querySnapshot.size} images from Firestore.`);

                const items = [];
                const aspects = ['aspect-[3/4]', 'aspect-[4/3]', 'aspect-square'];

                querySnapshot.forEach((doc, index) => {
                    const data = doc.data();
                    items.push({
                        id: doc.id,
                        src: data.url,
                        category: data.category || 'Interior',
                        title: data.title || 'Gallery Image',
                        date: data.date,
                        aspect: aspects[index % 3]
                    });
                });

                setGalleryImages(items);
            } catch (error) {
                console.error("Gallery: Error fetching images:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Initialize Scroll Position to Middle (Only after images are loaded)
    useEffect(() => {
        if (!loading && galleryImages.length > 0 && scrollRef.current && !scrollInitialized.current) {
            // Wait for render
            setTimeout(() => {
                if (!scrollRef.current) return;

                const { children } = scrollRef.current;
                // If we have enough items for the triple loop
                if (children.length >= galleryImages.length * 3 + 1) {
                    const firstItem = children[1];
                    const secondSetFirstItem = children[1 + galleryImages.length];
                    if (firstItem && secondSetFirstItem) {
                        const oneSetWidth = secondSetFirstItem.offsetLeft - firstItem.offsetLeft;
                        scrollRef.current.scrollLeft = oneSetWidth;
                        scrollInitialized.current = true;
                    }
                }
            }, 300); // Slightly longer delay to ensure DOM is ready
        }
    }, [loading, galleryImages]);

    // Keyboard Navigation for Lightbox
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!selectedImage) return;

            if (e.key === 'Escape') setSelectedImage(null);
            if (e.key === 'ArrowLeft') {
                const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
                if (currentIndex === -1) return;
                const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
                setSelectedImage(galleryImages[prevIndex]);
            }
            if (e.key === 'ArrowRight') {
                const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
                if (currentIndex === -1) return;
                const nextIndex = (currentIndex + 1) % galleryImages.length;
                setSelectedImage(galleryImages[nextIndex]);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage, galleryImages]);

    // Infinite Scroll Handler
    const handleScroll = () => {
        if (!scrollRef.current || galleryImages.length === 0) return;

        const { scrollLeft, clientWidth, children } = scrollRef.current;
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

                        {loading && (
                            <div className="w-full h-[400px] flex items-center justify-center text-gray-400">
                                Loading gallery...
                            </div>
                        )}

                        {!loading && galleryImages.length === 0 && (
                            <div className="w-full h-[400px] flex items-center justify-center text-gray-400">
                                No images yet. Coming soon!
                            </div>
                        )}

                        {/* Infinite Loop: Triplicated Data */}
                        {!loading && galleryImages.length > 0 && [...galleryImages, ...galleryImages, ...galleryImages].map((image, index) => (
                            <motion.div
                                key={`${image.id}-${index}`}
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: (index % 5) * 0.1 }}
                                viewport={{ once: true }}
                                className={`relative group rounded-2xl overflow-hidden flex-none h-[400px] md:h-[500px] snap-center ${image.aspect}`}
                                onClick={() => setSelectedImage(image)}
                            >
                                <div className="w-full h-full overflow-hidden">
                                    <motion.img
                                        src={image.src}
                                        alt={image.category}
                                        className="w-full h-full object-cover"
                                        style={{ filter: 'contrast(1.05) saturate(0.85) sepia(0.05) brightness(1.02)' }}
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
                            className="absolute top-6 right-6 text-white hover:text-[var(--color-secondary)] transition-colors z-50"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X size={32} />
                        </button>

                        {/* Navigation Buttons for Lightbox */}
                        <button
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/50 hover:text-white transition-colors z-50"
                            onClick={(e) => {
                                e.stopPropagation();
                                const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
                                if (currentIndex === -1) return;
                                const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
                                setSelectedImage(galleryImages[prevIndex]);
                            }}
                        >
                            <ChevronLeft size={48} />
                        </button>

                        <button
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/50 hover:text-white transition-colors z-50"
                            onClick={(e) => {
                                e.stopPropagation();
                                const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
                                if (currentIndex === -1) return;
                                const nextIndex = (currentIndex + 1) % galleryImages.length;
                                setSelectedImage(galleryImages[nextIndex]);
                            }}
                        >
                            <ChevronRight size={48} />
                        </button>

                        <motion.img
                            key={selectedImage.id}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            src={selectedImage.src}
                            alt={selectedImage.category}
                            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                            style={{ filter: 'contrast(1.05) saturate(0.85) sepia(0.05) brightness(1.02)' }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Gallery;
