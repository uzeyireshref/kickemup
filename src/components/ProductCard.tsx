import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import FavoriteAuthModal from './FavoriteAuthModal';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../hooks/useFavorites';
import { formatCurrency, getPriceDisplayData } from '../lib/pricing';
import type { ProductData } from '../types/product';
import './ProductCard.css';

export type { ProductData } from '../types/product';

interface ProductCardProps {
  product: ProductData;
  onAddToCart?: (product: ProductData) => void;
  layoutType?: 'grid' | 'slider';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, layoutType = 'grid' }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorite, isPending, toggleFavorite } = useFavorites();

  const brandName = product.brands?.name || product.brand || 'KickEmUp';
  const displayImage = product.product_images?.[0]?.url || product.image_url || product.image || '';
  const priceData = getPriceDisplayData(product.price, product.discount_percentage);
  const favoriteActive = isFavorite(product.id);
  const favoritePending = isPending(product.id);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      await toggleFavorite(product.id);
    } catch (error) {
      console.error('Product card favorite error:', error);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) onAddToCart(product);
  };

  const goToDetail = () => {
    navigate(`/product/${product.slug}`);
  };

  return (
    <>
      <motion.div 
        className={`universal-product-card ${layoutType}`}
        onClick={goToDetail}
        initial={layoutType === 'grid' ? { opacity: 0, y: 30 } : { opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, y: 0, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4 }}
      >
        <div className="upc-image-wrap">
          {priceData.hasDiscount && (
            <span className="upc-discount-badge">-%{priceData.discountPercentage}</span>
          )}
          <img src={displayImage} alt={product.name} loading="lazy" />
          
          <button
            type="button"
            className={`upc-wishlist-btn${favoriteActive ? ' is-active' : ''}`}
            onClick={handleLike}
            aria-label={favoriteActive ? 'Favorilerden çıkar' : 'Favorilere ekle'}
            aria-pressed={favoriteActive}
            disabled={favoritePending}
          >
            <Heart 
              size={20}
              fill={favoriteActive ? "#c81d3a" : "none"}
              stroke={favoriteActive ? "#c81d3a" : "#111"}
              strokeWidth={1.5}
              absoluteStrokeWidth
              className={favoriteActive ? "liked-anim" : ""}
            />
          </button>

          <button className="upc-add-cart-btn" onClick={handleAddToCart}>
            Sepete Ekle
          </button>
        </div>

        <div className="upc-info">
          <span className="upc-brand">{brandName}</span>
          <h3 className="upc-name">{product.name}</h3>
          <div className="upc-price-wrap">
            {priceData.hasDiscount && (
              <span className="upc-price-old">{formatCurrency(priceData.originalPrice)}</span>
            )}
            <p className={`upc-price${priceData.hasDiscount ? ' discounted' : ''}`}>
              {formatCurrency(priceData.discountedPrice)}
            </p>
          </div>
        </div>
      </motion.div>

      <FavoriteAuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default ProductCard;
