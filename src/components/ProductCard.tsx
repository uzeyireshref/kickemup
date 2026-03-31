import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import './ProductCard.css';

export interface ProductData {
  id: string | number;
  slug: string;
  name: string;
  price: number | string;
  image?: string;
  image_url?: string;
  brand?: any;
  category?: any;
  product_images?: { url: string }[];
  categories?: { name: string };
  brands?: { name: string };
  created_at?: string;
  product_variants?: { size?: string; color?: string; stock_quantity?: number }[];
}

interface ProductCardProps {
  product: ProductData;
  onAddToCart?: (product: ProductData) => void;
  layoutType?: 'grid' | 'slider';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, layoutType = 'grid' }) => {
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  // Supabase relational mapping or fallback
  const brandName = product.brands?.name || product.brand || 'KickEmUp';
  const displayImage = product.product_images?.[0]?.url || product.image_url || product.image || '';
  
  // Format price if it's a number
  const displayPrice = typeof product.price === 'number' 
    ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(product.price)
    : product.price;

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) onAddToCart(product);
  };

  const goToDetail = () => {
    navigate(`/product/${product.slug}`);
  };

  return (
    <motion.div 
      className={`universal-product-card ${layoutType}`}
      onClick={goToDetail}
      initial={layoutType === 'grid' ? { opacity: 0, y: 30 } : { opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
    >
      <div className="upc-image-wrap">
        <img src={displayImage} alt={product.name} loading="lazy" />
        
        <button className="upc-wishlist-btn" onClick={handleLike}>
          <Heart 
            size={20} 
            fill={isLiked ? "#e74c3c" : "transparent"} 
            stroke={isLiked ? "#e74c3c" : "#111"} 
            strokeWidth={1.5}
            className={isLiked ? "liked-anim" : ""}
          />
        </button>

        <button className="upc-add-cart-btn" onClick={handleAddToCart}>
          Sepete Ekle
        </button>
      </div>

      <div className="upc-info">
        <span className="upc-brand">{brandName}</span>
        <h3 className="upc-name">{product.name}</h3>
        <p className="upc-price">{displayPrice}</p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
