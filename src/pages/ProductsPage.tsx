import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './ProductsPage.css';
import { allProducts } from '../data/products';

interface ProductsPageProps {
  onProductClick: (product: any) => void;
}

const filterCategories = [
  { id: 'marka', label: 'MARKA', options: ['Nike', 'Jordan', 'adidas', 'New Balance', 'Vans', 'Carhartt WIP', 'A.P.C.'] },
  { id: 'sneakerModel', label: 'SNEAKER MODEL', options: [] },
  { id: 'urunTipi', label: 'ÜRÜN TİPİ', options: [] },
  { id: 'sneakerNumara', label: 'SNEAKER NUMARA', options: [] },
  { id: 'giyimBeden', label: 'GİYİM BEDEN', options: [] },
  { id: 'pantolonBeden', label: 'PANTOLON BEDEN', options: [] },
  { id: 'renk', label: 'RENK', options: [] },
  { id: 'indirimOrani', label: 'İNDİRİM ORANI', options: [] },
];

const ProductsPage: React.FC<ProductsPageProps> = ({ onProductClick }) => {
  const [openAccordion, setOpenAccordion] = useState<string>('marka');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? '' : id);
  };

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  // Basic filtering implementation for brands specifically, simulating real behavior
  const filteredProducts = selectedBrands.length > 0 
    ? allProducts.filter(p => selectedBrands.some(brand => p.name.includes(brand) || p.category === brand))
    : allProducts;

  return (
    <motion.div 
      className="products-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="breadcrumb">
        <a href="#" className="breadcrumb-link" onClick={(e) => { e.preventDefault(); }}>Anasayfa</a>
        <span className="breadcrumb-separator">›</span>
        <span>Yeniler</span>
      </div>

      <div className="products-header">
        <h1 className="products-title">Yeniler</h1>
        <div className="sort-dropdown">
          Öne Çıkanlar <ChevronDown size={18} />
        </div>
      </div>

      <div className="products-layout">
        <aside className="filters-sidebar">
          {filterCategories.map(item => (
            <div key={item.id} className="filter-accordion">
              <div className="filter-accordion-header" onClick={() => toggleAccordion(item.id)}>
                {item.label}
                {openAccordion === item.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              {openAccordion === item.id && item.options.length > 0 && (
                <div className="filter-accordion-content">
                  {item.options.map(option => (
                    <label key={option} className="filter-checkbox">
                      <input 
                        type="checkbox" 
                        checked={selectedBrands.includes(option)}
                        onChange={() => handleBrandToggle(option)}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </aside>

        <section className="products-grid-container">
          <div className="products-grid">
            {filteredProducts.map(product => {
              // Extract a mock brand name from product name for generic display purposes
              const brand = product.name.split(' ')[0];
              
              return (
                <div key={product.id} className="product-card-wunder" onClick={() => onProductClick(product)}>
                  <div className="product-image-wrap">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="product-brand">{brand}</div>
                  <div className="product-name">{product.name}</div>
                  <div className="product-price">{product.price}</div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default ProductsPage;
