import React, { useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import './ProductSlider.css';
import ProductCard from './ProductCard';

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
  onAddToCart?: (product: any) => void;
}

const ProductSlider: React.FC<ProductSliderProps> = ({ title, products, onAddToCart }) => {
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
        {products.map((product) => (
          <div className="slider-card-wrap" key={product.id}>
             <ProductCard 
               product={product as any} 
               onAddToCart={onAddToCart} 
               layoutType="slider" 
             />
          </div>
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
