import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, SlidersHorizontal, X, Check } from 'lucide-react';
import './ProductsPage.css';
import { allProducts } from '../data/products';
import ProductCard from '../components/ProductCard';

interface ProductsPageProps {
  onProductClick: (product: any) => void;
  onAddToCart?: (product: any) => void;
}

const filterCategories = [
  {
    id: 'marka',
    label: 'MARKA',
    type: 'checkbox',
    options: ['Nike', 'Jordan', 'adidas', 'New Balance', 'Vans', 'Carhartt WIP', 'A.P.C.', 'Oakley'],
  },
  {
    id: 'sneakerModel',
    label: 'SNEAKER MODEL',
    type: 'checkbox',
    options: [
      'Air Force 1', 'Air Max 90', 'Air Max 95', 'Air Max 97', 'Air Max 270',
      'Dunk Low', 'Dunk High', 'Jordan 1', 'Jordan 4', 'Jordan 6',
      'Astrograbber', 'Classic Slip-On', 'Authentic 44', 'Old Skool',
      '574', '990v5', '327', '2002R',
    ],
  },
  {
    id: 'urunTipi',
    label: 'ÜRÜN TİPİ',
    type: 'checkbox',
    options: [
      'Sneaker', 'Bot', 'Terlik', 'Sandalet',
      'T-Shirt', 'Sweatshirt', 'Hoodie', 'Gömlek',
      'Pantolon', 'Şort', 'Mont', 'Ceket',
      'Aksesuar', 'Şapka', 'Çorap', 'Çanta', 'Güneş Gözlüğü',
    ],
  },
  {
    id: 'sneakerNumara',
    label: 'SNEAKER NUMARA',
    type: 'checkbox',
    options: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47'],
  },
  {
    id: 'giyimBeden',
    label: 'GİYİM BEDEN',
    type: 'checkbox',
    options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  },
  {
    id: 'pantolonBeden',
    label: 'PANTOLON BEDEN',
    type: 'checkbox',
    options: ['28/30', '29/32', '30/30', '30/32', '31/32', '32/30', '32/32', '33/32', '34/32', '36/32'],
  },
  {
    id: 'renk',
    label: 'RENK',
    type: 'color',
    options: [
      { label: 'Siyah', value: 'Siyah', hex: '#1a1a1a' },
      { label: 'Beyaz', value: 'Beyaz', hex: '#f0f0f0' },
      { label: 'Gri', value: 'Gri', hex: '#9e9e9e' },
      { label: 'Bej', value: 'Bej', hex: '#c8b49a' },
      { label: 'Kahverengi', value: 'Kahverengi', hex: '#7a5230' },
      { label: 'Lacivert', value: 'Lacivert', hex: '#1a2b5e' },
      { label: 'Mavi', value: 'Mavi', hex: '#1976d2' },
      { label: 'Kırmızı', value: 'Kırmızı', hex: '#d32f2f' },
      { label: 'Yeşil', value: 'Yeşil', hex: '#2e7d32' },
      { label: 'Turuncu', value: 'Turuncu', hex: '#e65100' },
      { label: 'Sarı', value: 'Sarı', hex: '#f9a825' },
      { label: 'Mor', value: 'Mor', hex: '#6a1b9a' },
      { label: 'Pembe', value: 'Pembe', hex: '#e91e8c' },
      { label: 'Haki', value: 'Haki', hex: '#7a7a3a' },
    ],
  },
  {
    id: 'indirimOrani',
    label: 'İNDİRİM ORANI',
    type: 'checkbox',
    options: ['%10 ve üzeri', '%20 ve üzeri', '%30 ve üzeri', '%40 ve üzeri', '%50 ve üzeri'],
  },
];

const sortOptions = [
  { label: 'Öne Çıkanlar', value: 'featured' },
  { label: 'En Yeniler', value: 'newest' },
  { label: 'En Çok Satanlar', value: 'bestseller' },
  { label: 'Fiyat: Düşükten Yükseğe', value: 'price_asc' },
  { label: 'Fiyat: Yüksekten Düşüğe', value: 'price_desc' },
  { label: 'İndirim Oranı', value: 'discount' },
  { label: 'Değerlendirme (En İyi)', value: 'rating' },
];

function parsePrice(priceStr: string): number {
  return parseFloat(priceStr.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ onProductClick, onAddToCart }) => {
  const [openAccordions, setOpenAccordions] = useState<string[]>(['marka']);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [sortValue, setSortValue] = useState('featured');
  const [sortOpen, setSortOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close sort dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Lock body scroll when mobile filter is open
  useEffect(() => {
    if (mobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileFilterOpen]);

  const toggleAccordion = (id: string) => {
    setOpenAccordions(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleFilterToggle = (filterId: string, option: string) => {
    setSelectedFilters(prev => {
      const current = prev[filterId] || [];
      return {
        ...prev,
        [filterId]: current.includes(option)
          ? current.filter(o => o !== option)
          : [...current, option],
      };
    });
  };

  const clearAllFilters = () => setSelectedFilters({});

  const totalActiveFilters = Object.values(selectedFilters).reduce((sum, arr) => sum + arr.length, 0);

  // Filter products
  let filteredProducts = allProducts.filter(product => {
    const brandFilter = selectedFilters['marka'] || [];
    if (brandFilter.length > 0 && !brandFilter.includes(product.brand)) return false;
    const typeFilter = selectedFilters['urunTipi'] || [];
    if (typeFilter.length > 0 && !typeFilter.includes(product.category)) return false;
    return true;
  });

  // Sort products
  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortValue === 'price_asc') return parsePrice(a.price) - parsePrice(b.price);
    if (sortValue === 'price_desc') return parsePrice(b.price) - parsePrice(a.price);
    if (sortValue === 'newest') return b.id - a.id;
    return 0;
  });

  const currentSortLabel = sortOptions.find(o => o.value === sortValue)?.label || 'Öne Çıkanlar';

  const renderFilterContent = (item: typeof filterCategories[0]) => {
    if (item.type === 'color') {
      const colorOptions = item.options as { label: string; value: string; hex: string }[];
      return (
        <div className="filter-color-grid">
          {colorOptions.map(color => {
            const selected = (selectedFilters[item.id] || []).includes(color.value);
            return (
              <button
                key={color.value}
                className={`filter-color-swatch${selected ? ' selected' : ''}`}
                title={color.label}
                onClick={() => handleFilterToggle(item.id, color.value)}
              >
                <span className="swatch-circle" style={{ background: color.hex }} />
                {selected && <Check size={10} className="swatch-check" />}
                <span className="swatch-label">{color.label}</span>
              </button>
            );
          })}
        </div>
      );
    }

    const strOptions = item.options as string[];
    return (
      <div className="filter-accordion-content">
        {strOptions.map(option => {
          const checked = (selectedFilters[item.id] || []).includes(option);
          return (
            <label key={option} className={`filter-checkbox${checked ? ' checked' : ''}`}>
              <span className={`custom-checkbox${checked ? ' checked' : ''}`}>
                {checked && <Check size={11} />}
              </span>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => handleFilterToggle(item.id, option)}
              />
              <span>{option}</span>
            </label>
          );
        })}
      </div>
    );
  };

  const sidebarContent = (
    <div className="filters-sidebar-inner">
      <div className="filter-sidebar-top">
        <span className="filter-sidebar-title">Filtreler</span>
        {totalActiveFilters > 0 && (
          <button className="clear-filters-btn" onClick={clearAllFilters}>
            Temizle ({totalActiveFilters})
          </button>
        )}
      </div>

      {filterCategories.map(item => {
        const isOpen = openAccordions.includes(item.id);
        const activeCount = (selectedFilters[item.id] || []).length;
        return (
          <div key={item.id} className="filter-accordion">
            <div
              className="filter-accordion-header"
              onClick={() => toggleAccordion(item.id)}
            >
              <span>
                {item.label}
                {activeCount > 0 && (
                  <span className="filter-active-badge">{activeCount}</span>
                )}
              </span>
              {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  style={{ overflow: 'hidden' }}
                >
                  {renderFilterContent(item)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );

  return (
    <motion.div
      className="products-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="breadcrumb">
        <a href="#" className="breadcrumb-link">Anasayfa</a>
        <span className="breadcrumb-separator">›</span>
        <span>Yeniler</span>
      </div>

      <div className="products-header">
        <h1 className="products-title">Yeniler</h1>
        <div className="products-header-right">
          {/* Mobile filter trigger */}
          <button
            className="mobile-filter-btn"
            onClick={() => setMobileFilterOpen(true)}
            aria-label="Filtreleri aç"
          >
            <SlidersHorizontal size={18} />
            <span>Filtreler</span>
            {totalActiveFilters > 0 && (
              <span className="mobile-filter-badge">{totalActiveFilters}</span>
            )}
          </button>

          {/* Sort dropdown */}
          <div className="sort-dropdown-wrap" ref={sortRef}>
            <button
              className="sort-dropdown"
              onClick={() => setSortOpen(prev => !prev)}
              aria-expanded={sortOpen}
            >
              <span>{currentSortLabel}</span>
              <ChevronDown size={16} className={`sort-chevron${sortOpen ? ' open' : ''}`} />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  className="sort-menu"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                >
                  {sortOptions.map(opt => (
                    <button
                      key={opt.value}
                      className={`sort-menu-item${sortValue === opt.value ? ' active' : ''}`}
                      onClick={() => { setSortValue(opt.value); setSortOpen(false); }}
                    >
                      {opt.label}
                      {sortValue === opt.value && <Check size={14} />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="products-layout">
        {/* Desktop sidebar */}
        <aside className="filters-sidebar">
          {sidebarContent}
        </aside>

        {/* Product grid */}
        <section className="products-grid-container">
          <div className="products-result-info">
            <span>{filteredProducts.length} ürün</span>
            {totalActiveFilters > 0 && (
              <button className="clear-filters-inline" onClick={clearAllFilters}>
                Filtreleri Temizle
              </button>
            )}
          </div>
          <div className="products-grid">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id}
                product={product}
                onClick={onProductClick}
                onAddToCart={onAddToCart}
                layoutType="grid"
              />
            ))}
          </div>
        </section>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div
              className="filter-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
            />
            <motion.div
              className="filter-drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div className="filter-drawer-header">
                <span>Filtreler</span>
                <button
                  className="filter-drawer-close"
                  onClick={() => setMobileFilterOpen(false)}
                  aria-label="Kapat"
                >
                  <X size={22} />
                </button>
              </div>
              <div className="filter-drawer-body">
                {sidebarContent}
              </div>
              <div className="filter-drawer-footer">
                <button className="apply-filters-btn" onClick={() => setMobileFilterOpen(false)}>
                  {filteredProducts.length} Ürünü Göster
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductsPage;
