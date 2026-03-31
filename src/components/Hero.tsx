import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Hero.css';

import jordanImg from '../assets/hero/jordan.png';
import adidasImg from '../assets/hero/adidas.png';
import converseImg from '../assets/hero/converse.png';
import nbImg from '../assets/hero/newbalance.png';

const slides = [
  {
    id: 1,
    image: jordanImg,
    title: 'JORDAN 1 HIGH',
    subtitle: 'Limited edition collaboration that redefines street style.',
    buttonText: 'ŞİMDİ KEŞFET'
  },
  {
    id: 2,
    image: adidasImg,
    title: 'ADIDAS X BRAIN DEAD',
    subtitle: 'A fusion of artistic graphics and performance gear.',
    buttonText: 'KOLEKSİYONU GÖR'
  },
  {
    id: 3,
    image: converseImg,
    title: 'CONVERSE MODERN',
    subtitle: 'Clean lines for the contemporary trendsetter.',
    buttonText: 'TÜMÜNÜ İNCELE'
  },
  {
    id: 4,
    image: nbImg,
    title: 'NEW BALANCE LUXURY',
    subtitle: 'High-end craftsmanship meets unparalleled comfort.',
    buttonText: 'ALIŞVERİŞE BAŞLA'
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


    </section>
  );
};

export default Hero;
