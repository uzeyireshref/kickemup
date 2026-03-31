import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import './ProductSlider.css';

export interface Product {
  id: string | number;
  brand: string;
  name: string;
  price: string;
  image: string;
}

interface ProductSliderProps {
  title: string;
  products: Product[];
  onProductClick?: (product: Product) => void;
}

const ProductSlider: React.FC<ProductSliderProps> = ({ title, products, onProductClick }) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const slide = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 280 : 350;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="product-slider-section">
      <div className="slider-header-wrapper">
        <h2 className="slider-title">{title}</h2>
      </div>
      
      <div className="slider-wrapper">
        <div className="slider-container" ref={sliderRef}>
        {products.map((product, index) => (
          <motion.div 
            key={product.id} 
            className="slider-card"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => onProductClick && onProductClick(product)}
          >
            <div className="slider-image-container">
              <img src={product.image} alt={product.name} className="slider-image" />
            </div>
            <div className="slider-info">
              <span className="slider-brand">{product.brand}</span>
              <h3 className="slider-name">{product.name}</h3>
              <p className="slider-price">{product.price}</p>
            </div>
          </motion.div>
        ))}
        </div>
        
        {/* Float Controls */}
        <button className="slider-nav-btn slider-nav-left" onClick={() => slide('left')} aria-label="Sola kaydır">
          <ChevronLeft size={24} color="#666" />
        </button>
        <button className="slider-nav-btn slider-nav-right" onClick={() => slide('right')} aria-label="Sağa kaydır">
          <ChevronRight size={24} color="#666" />
        </button>
      </div>
    </section>
  );
};

export default ProductSlider;
