import React from 'react';
import { motion } from 'framer-motion';
import './ProductShowcase.css';
import { allProducts } from '../data/products';

const products = allProducts;

interface Props {
  onProductClick?: (product: any) => void;
  onAddToCart?: (product: any) => void;
}

const ProductShowcase: React.FC<Props> = ({ onProductClick, onAddToCart }) => {
  return (
    <section className="product-showcase" id="new">
      <motion.div 
        className="showcase-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">Seçili Parçalar</h2>
        <a href="#all" className="view-all">Tümünü Gör →</a>
      </motion.div>
      
      <div className="product-grid">
        {products.map((product, index) => (
          <motion.div 
            key={product.id} 
            className="product-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            onClick={() => onProductClick && onProductClick({
              id: product.id,
              brand: product.name.split(' ')[0], // Dummy brand
              name: product.name,
              price: product.price,
              image: product.image
            })}
          >
            <div className="product-image-container">
              <img src={product.image} alt={product.name} className="product-image" />
              <button 
                className="add-to-cart-quick"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onAddToCart) {
                    onAddToCart({
                      id: product.id,
                      brand: 'Giyim',
                      name: product.name,
                      price: product.price,
                      image: product.image
                    });
                  }
                }}
              >
                Sepete Ekle
              </button>
            </div>
            <div className="product-info">
              <span className="product-category">{product.category}</span>
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">{product.price}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProductShowcase;
