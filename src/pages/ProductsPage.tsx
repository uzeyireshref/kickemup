import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, SlidersHorizontal, X, Check, Loader2, AlertCircle } from 'lucide-react';
import './ProductsPage.css';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import type { ProductData } from '../components/ProductCard';

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
    id: 'urunTipi',
    label: 'ÜRÜN TİPİ',
    type: 'checkbox',
    options: [
      'Sneaker', 'Bot', 'Terlik', 'Sandalet',
      'Giyim', 'Aksesuar', 'T-Shirt', 'Sweatshirt', 'Hoodie', 'Gömlek',
      'Pantolon', 'Şort', 'Mont', 'Ceket',
      'Şapka', 'Çorap', 'Çanta', 'Güneş Gözlüğü',
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
    id: 'renk',
    label: 'RENK',
    type: 'color',
    options: [
      { label: 'Siyah', value: 'Siyah', hex: '#1a1a1a' },
      { label: 'Beyaz', value: 'Beyaz', hex: '#f0f0f0' },
      { label: 'Gri', value: 'Gri', hex: '#9e9e9e' },
      { label: 'Bej', value: 'Bej', hex: '#c8b49a' },
      { label: 'Kahverengi', value: 'Kahverengi', hex: '#7a5230' },
    ],
  },
];

const sortOptions = [
  { label: 'Öne Çıkanlar', value: 'featured' },
  { label: 'En Yeniler', value: 'newest' },
  { label: 'Fiyat: Düşükten Yükseğe', value: 'price_asc' },
  { label: 'Fiyat: Yüksekten Düşüğe', value: 'price_desc' },
];

const ProductsPage: React.FC<ProductsPageProps> = ({ onProductClick, onAddToCart }) => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openAccordions, setOpenAccordions] = useState<string[]>(['marka', 'urunTipi']);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [sortValue, setSortValue] = useState('featured');
  const [sortOpen, setSortOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data, error: sbError } = await supabase
          .from('products')
          .select(`
            *,
            brands(name),
            categories(name),
            product_images(url),
            product_variants(*)
          `);
        
        if (sbError) throw sbError;
        
        // Map data to handle Supabase join inconsistencies (singular/plural/array)
        const mappedProducts = (data || []).map((p: any) => {
          // Check all common entry points for joined categories
          const cat = p.categories || p.category || p.category_details || {};
          const catData = Array.isArray(cat) ? cat[0] : cat;
          
          const brand = p.brands || p.brand || p.brand_details || {};
          const brandData = Array.isArray(brand) ? brand[0] : brand;

          return {
            ...p,
            brand_name: brandData?.name || '',
            category_name: catData?.name || '',
            main_image: (p.product_images && Array.isArray(p.product_images))
              ? (p.product_images.find((img: any) => img.is_main)?.url || p.product_images[0]?.url || '')
              : ''
          };
        });
        
        setProducts(mappedProducts);
      } catch (err: any) {
        console.error('Supabase fetch error:', err);
        setError(err.message || 'Ürünler yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    const applyUrlParams = () => {
      const params = new URLSearchParams(window.location.search);
      const category = params.get('category');
      const sort = params.get('sort');
      
      // Automatic Selection: Set initial filter state from URL
      setSelectedFilters(category ? { urunTipi: [category.trim()] } : {});
      
      if (sort) {
        setSortValue(sort);
      } else {
        setSortValue('featured');
      }
    };

    fetchData();
    applyUrlParams();
    
    // URL Observer/Listener
    window.addEventListener('popstate', applyUrlParams);
    return () => window.removeEventListener('popstate', applyUrlParams);
  }, []);

  // URL parametrelerini oku
  const params = new URLSearchParams(window.location.search);
  const currentCategory = params.get('category');
  const pageTitle = currentCategory ? currentCategory.toUpperCase() : 'TÜM ÜRÜNLER';

  // Bağlamsal filtre mantığı: URL parametresi VE kullanıcının seçimleri göz önünde tutulur
  const activeTypes = selectedFilters['urunTipi'] || [];

  // Ayakkabı ve Giyim bağlamlarını belirle
  const isSneakerContext = currentCategory === 'Sneaker' || activeTypes.some(t => ['Sneaker', 'Bot', 'Terlik', 'Sandalet'].includes(t));
  const isGiyimContext   = currentCategory === 'Giyim'   || activeTypes.some(t => ['Giyim', 'T-Shirt', 'Sweatshirt', 'Hoodie', 'Pantolon', 'Mont', 'Şort', 'Gömlek', 'Ceket'].includes(t));

  // displayedFilters: hangi filtre gruplarının gösterileceği
  const displayedFilters = filterCategories.filter(cat => {
    // Tüm ürünler sayfasındaysak (kategori seçili değilse AND manuel tip seçilmemişse) her şeyi göster
    if (currentCategory === null && activeTypes.length === 0) return true;
    
    // Ayakkabı numaralarını sadece ayakkabı bağlamında göster
    if (cat.id === 'sneakerNumara' && !isSneakerContext) return false;
    
    // Giyim bedenlerini sadece giyim bağlamında göster
    if (cat.id === 'giyimBeden' && !isGiyimContext) return false;
    
    return true;
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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

  // Advanced Client-side filtering logic with Variants
  let filteredProducts = products.filter((product: any) => {
    const brandName = product.brand_name || '';
    const catName = product.category_name || '';
    const variants = product.product_variants || [];
    
    // Existing Brand & Category Filters (Robust Case-Insensitive Match)
    const brandFilter = (selectedFilters['marka'] || []).map(f => decodeURIComponent(f).trim().toLowerCase());
    if (brandFilter.length > 0 && !brandFilter.includes(brandName.trim().toLowerCase())) return false;
    
    const typeFilter = (selectedFilters['urunTipi'] || []).map(f => decodeURIComponent(f).trim().toLowerCase());
    if (typeFilter.length > 0 && !typeFilter.includes(catName.trim().toLowerCase())) return false;

    // Shoe Size Filter
    const sizeFilter = selectedFilters['sneakerNumara'] || [];
    if (sizeFilter.length > 0) {
      const hasSize = variants.some((v: any) => v.size && sizeFilter.includes(v.size));
      if (!hasSize) return false;
    }

    // Clothing Size Filter
    const clothingSizeFilter = selectedFilters['giyimBeden'] || [];
    if (clothingSizeFilter.length > 0) {
      const hasClothingSize = variants.some((v: any) => v.size && clothingSizeFilter.includes(v.size));
      if (!hasClothingSize) return false;
    }

    // Color Filter
    const colorFilter = selectedFilters['renk'] || [];
    if (colorFilter.length > 0) {
      const hasColor = variants.some((v: any) => v.color && colorFilter.includes(v.color));
      if (!hasColor) return false;
    }
    
    return true;
  });

  // Safe Sorting
  filteredProducts = [...filteredProducts].sort((a, b) => {
    const priceA = typeof a.price === 'number' ? a.price : parseFloat(String(a.price || 0));
    const priceB = typeof b.price === 'number' ? b.price : parseFloat(String(b.price || 0));

    if (sortValue === 'price_asc') return priceA - priceB;
    if (sortValue === 'price_desc') return priceB - priceA;
    if (sortValue === 'newest') {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    }
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

      {displayedFilters.map(item => {
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
        <span>{pageTitle}</span>
      </div>

      <div className="products-header">
        <h1 className="products-title">{pageTitle}</h1>
        <div className="products-header-right">
          <button
            className="mobile-filter-btn"
            onClick={() => setMobileFilterOpen(true)}
          >
            <SlidersHorizontal size={18} />
            <span>Filtreler</span>
            {totalActiveFilters > 0 && (
              <span className="mobile-filter-badge">{totalActiveFilters}</span>
            )}
          </button>

          <div className="sort-dropdown-wrap" ref={sortRef}>
            <button
              className="sort-dropdown"
              onClick={() => setSortOpen(prev => !prev)}
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
        <aside className="filters-sidebar">
          {sidebarContent}
        </aside>

        <section className="products-grid-container">
          {loading ? (
            <div className="loading-state">
              <Loader2 className="spinning" size={40} />
              <p>Ürünler Yükleniyor...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <AlertCircle size={40} color="#e74c3c" />
              <p>{error}</p>
              <button onClick={() => window.location.reload()} className="retry-btn">Tekrar Dene</button>
            </div>
          ) : (
            <>
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
            </>
          )}
        </section>
      </div>

      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div className="filter-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileFilterOpen(false)} />
            <motion.div className="filter-drawer" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}>
              <div className="filter-drawer-header">
                <span>Filtreler</span>
                <button onClick={() => setMobileFilterOpen(false)}><X size={22} /></button>
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

/*
ORIGINAL BACKUP:
[Gövdesel olarak aynı mantığa sahip olduğu için burada kısaltıldı, 
dosyanızın orjinal hali allProducts importu ile products-filter mantığını kullanıyordu.]
*/
