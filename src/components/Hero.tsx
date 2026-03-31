import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Hero.css';

const slides = [
  {
    id: 1,
    image: 'https://cdn.myikas.com/images/theme-images/32b5f3c2-9da8-4ad9-9902-c51f12b16eb6/image_3840.webp',
    title: 'NEW BALANCE 530',
    subtitle: 'İkonik retro koşu silüetiyle sokak modasına yön ver.',
    buttonText: 'ŞİMDİ KEŞFET'
  },
  {
    id: 2,
    image: 'https://cdn.myikas.com/images/theme-images/b2bd4d04-ced1-4b08-b2df-b149cba954b2/image_3840.webp',
    title: 'NIKE KOLEKSİYONU',
    subtitle: 'En güncel Nike modellerini ve klasik release\'leri yakala.',
    buttonText: 'TÜMÜNÜ İNCELE'
  },
  {
    id: 3,
    image: 'https://cdn.myikas.com/images/theme-images/1a9fda3b-f1e3-4ed6-aa66-f90f8a3fc9bf/image_3840.webp',
    title: 'ASICS GEL SERİSİ',
    subtitle: 'Konfor ve performansı bir arada sunan özel tasarımlar.',
    buttonText: 'ALIŞVERİŞE BAŞLA'
  },
  {
    id: 4,
    image: 'https://cdn.myikas.com/images/theme-images/86ddc9bc-20e6-401e-b818-896589688f09/image_3840.webp',
    title: 'ERKEK GİYİM',
    subtitle: 'Sokak stilini tamamlayacak premium markalar tek çatı altında.',
    buttonText: 'GİYİMİ KEŞFET'
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <section className="hero">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="hero-slide-container"
        >
          <img 
            src={slides[currentSlide].image} 
            alt={slides[currentSlide].title} 
            className="hero-image"
          />
          <div className="hero-overlay" />

          <div className="hero-content">
            <motion.h1 
              className="hero-title"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {slides[currentSlide].title}
            </motion.h1>
            <motion.p 
              className="hero-subtitle"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {slides[currentSlide].subtitle}
            </motion.p>
            <motion.button 
              className="btn-primary"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {slides[currentSlide].buttonText}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      <button className="hero-nav-button left" onClick={prevSlide}>
        <ChevronLeft size={36} color="white" />
      </button>
      <button className="hero-nav-button right" onClick={nextSlide}>
        <ChevronRight size={36} color="white" />
      </button>

      <div className="hero-indicators">
        {slides.map((_, index) => (
          <div 
            key={index} 
            className={`hero-indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
