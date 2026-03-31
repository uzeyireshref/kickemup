import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import './ProductCard.css';

export interface ProductData {
  id: string | number;
  brand?: string;
  category?: string;
  name: string;
  price: string;
  image: string;
}

interface ProductCardProps {
  product: ProductData;
  onClick?: (product: ProductData) => void;
  onAddToCart?: (product: ProductData) => void;
  layoutType?: 'grid' | 'slider'; // to tweak width/flex if necessary, defaults to grid
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onAddToCart, layoutType = 'grid' }) => {
  const [isLiked, setIsLiked] = useState(false);
  const brand = product.brand || product.category || product.name.split(' ')[0];

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <motion.div 
      className={`universal-product-card ${layoutType}`}
      onClick={() => onClick && onClick(product)}
      initial={layoutType === 'grid' ? { opacity: 0, y: 30 } : { opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
    >
      <div className="upc-image-wrap">
        <img src={product.image} alt={product.name} loading="lazy" />
        
        {/* Wishlist Heart */}
        <button 
          className="upc-wishlist-btn" 
          onClick={handleLike}
          aria-label={isLiked ? "Listeden çıkar" : "Favorilere ekle"}
        >
          <Heart 
            size={20} 
            fill={isLiked ? "#e74c3c" : "transparent"} 
            stroke={isLiked ? "#e74c3c" : "#111"} 
            strokeWidth={1.5}
            className={isLiked ? "liked-anim" : ""}
          />
        </button>

        {/* Add to Cart Overlay */}
        <button className="upc-add-cart-btn" onClick={handleAddToCart}>
          Sepete Ekle
        </button>
      </div>

      <div className="upc-info">
        <span className="upc-brand">{brand}</span>
        <h3 className="upc-name">{product.name}</h3>
        <p className="upc-price">{product.price}</p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
