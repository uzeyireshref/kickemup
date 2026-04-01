import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, SlidersHorizontal, X, Check, Loader2, AlertCircle } from 'lucide-react';
import './ProductsPage.css';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import type { ProductData } from '../components/ProductCard';

interface ProductsPageProps {
  onAddToCart?: (product: any) => void;
}

const filterCategories = [
  {
    id: 'marka',
    label: 'MARKA',
    type: 'checkbox',
    options: ['Nike', 'Jordan', 'adidas', 'Asics', 'Champion', 'New Balance', 'Puma', 'Vans', 'Carhartt WIP', 'A.P.C.', 'Oakley'],
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

const brandParamMap: Record<string, string> = {
  nike: 'Nike',
  jordan: 'Jordan',
  adidas: 'adidas',
  asics: 'Asics',
  champion: 'Champion',
  'new-balance': 'New Balance',
  newbalance: 'New Balance',
  puma: 'Puma',
  vans: 'Vans',
  'carhartt-wip': 'Carhartt WIP',
  carharttwip: 'Carhartt WIP',
  'a.p.c.': 'A.P.C.',
  'a-p-c': 'A.P.C.',
  oakley: 'Oakley',
};

const brandFilterToParamMap: Record<string, string> = {
  Nike: 'nike',
  Jordan: 'jordan',
  adidas: 'adidas',
  Asics: 'asics',
  Champion: 'champion',
  'New Balance': 'new-balance',
  Puma: 'puma',
  Vans: 'vans',
  'Carhartt WIP': 'carhartt-wip',
  'A.P.C.': 'a-p-c',
  Oakley: 'oakley',
};

const parseBrandParam = (param: string): string[] => {
  const normalized = param
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => value.toLowerCase().replace(/\s+/g, '-'));

  const mapped = normalized.map((value) => brandParamMap[value] || value);
  return Array.from(new Set(mapped));
};

const buildBrandParam = (brands: string[]): string => {
  const values = brands.map((brand) => brandFilterToParamMap[brand] || brand.toLowerCase().replace(/\s+/g, '-'));
  return values.join(',');
};

const ProductsPage: React.FC<ProductsPageProps> = ({ onAddToCart }) => {
  const [searchParams, setSearchParams] = useSearchParams();
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
    const category = searchParams.get('category');
    const sort = searchParams.get('sort');
    const brand = searchParams.get('brand');

    setSelectedFilters((prev) => {
      const currentUrunTipi = prev.urunTipi || [];
      const currentBrands = prev.marka || [];
      const urunTipiOptions = filterCategories.find(c => c.id === 'urunTipi')?.options as string[];
      let nextFilters = prev;
      let hasChange = false;

      if (category) {
        if (currentUrunTipi.length !== 1 || currentUrunTipi[0] !== category) {
          nextFilters = { ...nextFilters, urunTipi: [category] };
          hasChange = true;
        }
      } else if (currentUrunTipi.length === 1 && urunTipiOptions?.includes(currentUrunTipi[0])) {
        const { urunTipi: _, ...rest } = nextFilters;
        nextFilters = rest;
        hasChange = true;
      }

      if (brand) {
        const parsedBrands = parseBrandParam(brand);
        const isSameBrandSelection =
          parsedBrands.length === currentBrands.length &&
          parsedBrands.every((value, index) => value === currentBrands[index]);

        if (parsedBrands.length > 0 && !isSameBrandSelection) {
          nextFilters = { ...nextFilters, marka: parsedBrands };
          hasChange = true;
        }
      } else if (currentBrands.length > 0) {
        const { marka: _, ...rest } = nextFilters;
        nextFilters = rest;
        hasChange = true;
      }

      return hasChange ? nextFilters : prev;
    });

    if (sort) {
      setSortValue(sort);
    }
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const brandFilter = selectedFilters.marka || [];
        const typeFilter = selectedFilters.urunTipi || [];
        const sneakerSizeFilter = selectedFilters.sneakerNumara || [];
        const clothingSizeFilter = selectedFilters.giyimBeden || [];
        const colorFilter = selectedFilters.renk || [];
        const sizeFilter = [...new Set([...sneakerSizeFilter, ...clothingSizeFilter])];

        let variantProductIds: Array<string | number> | null = null;

        if (sizeFilter.length > 0 || colorFilter.length > 0) {
          let variantsQuery: any = supabase.from('product_variants').select('product_id');

          if (sizeFilter.length > 0) {
            variantsQuery = variantsQuery.in('size', sizeFilter);
          }

          if (colorFilter.length > 0) {
            variantsQuery = variantsQuery.in('color', colorFilter);
          }

          const { data: variantsData, error: variantsError } = await variantsQuery;
          if (variantsError) throw variantsError;

          variantProductIds = Array.from(
            new Set((variantsData || []).map((row: any) => row.product_id).filter(Boolean))
          );

          if (variantProductIds.length === 0) {
            if (isMounted) setProducts([]);
            return;
          }
        }

        let productsQuery: any = supabase
          .from('products')
          .select(`
            id,
            slug,
            name,
            price,
            created_at,
            brands!inner(name),
            categories!inner(name),
            product_images(url, is_main)
          `);

        if (brandFilter.length > 0) {
          productsQuery = productsQuery.in('brands.name', brandFilter);
        }

        if (typeFilter.length > 0) {
          productsQuery = productsQuery.in('categories.name', typeFilter);
        }

        if (variantProductIds) {
          productsQuery = productsQuery.in('id', variantProductIds);
        }

        if (sortValue === 'newest') {
          productsQuery = productsQuery.order('created_at', { ascending: false });
        } else if (sortValue === 'price_asc') {
          productsQuery = productsQuery.order('price', { ascending: true });
        } else if (sortValue === 'price_desc') {
          productsQuery = productsQuery.order('price', { ascending: false });
        }

        const { data, error: sbError } = await productsQuery;
        if (sbError) throw sbError;

        const mappedProducts = (data || []).map((p: any) => {
          const cat = p.categories || p.category || p.category_details || {};
          const catData = Array.isArray(cat) ? cat[0] : cat;
          const brand = p.brands || p.brand || p.brand_details || {};
          const brandData = Array.isArray(brand) ? brand[0] : brand;
          const mainImage = Array.isArray(p.product_images)
            ? (p.product_images.find((img: any) => img.is_main)?.url || p.product_images[0]?.url || '')
            : '';

          return {
            ...p,
            brand_name: brandData?.name || '',
            category_name: catData?.name || '',
            image_url: p.image_url || mainImage,
            main_image: mainImage
          };
        });

        if (isMounted) {
          setProducts(mappedProducts);
        }
      } catch (err: any) {
        console.error('Supabase fetch error:', err);
        if (isMounted) {
          setError(err.message || 'Ürünler yüklenirken bir hata oluştu.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [selectedFilters, sortValue]);

  const currentCategory = searchParams.get('category');
  const pageTitle = currentCategory ? currentCategory.toUpperCase() : 'TÜM ÜRÜNLER';
  const activeTypes = selectedFilters.urunTipi || [];

  const isSneakerContext = currentCategory === 'Sneaker' || activeTypes.some(t => ['Sneaker', 'Bot', 'Terlik', 'Sandalet'].includes(t));
  const isGiyimContext = currentCategory === 'Giyim' || activeTypes.some(t => ['Giyim', 'T-Shirt', 'Sweatshirt', 'Hoodie', 'Pantolon', 'Mont', 'Şort', 'Gömlek', 'Ceket'].includes(t));

  const displayedFilters = filterCategories.filter(cat => {
    if (!currentCategory && activeTypes.length === 0) return true;
    if (cat.id === 'sneakerNumara' && !isSneakerContext) return false;
    if (cat.id === 'giyimBeden' && !isGiyimContext) return false;
    return true;
  });

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
    setOpenAccordions(prev => (prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]));
  };

  const handleFilterToggle = (filterId: string, option: string) => {
    setSelectedFilters(prev => {
      const current = prev[filterId] || [];
      const isExist = current.includes(option);
      const next = isExist ? current.filter(o => o !== option) : [...current, option];

      if (filterId === 'urunTipi' || filterId === 'marka') {
        const newParams = new URLSearchParams(searchParams);

        if (filterId === 'urunTipi') {
          if (next.length === 1) {
            newParams.set('category', next[0]);
          } else {
            newParams.delete('category');
          }
        }

        if (filterId === 'marka') {
          if (next.length > 0) {
            newParams.set('brand', buildBrandParam(next));
          } else {
            newParams.delete('brand');
          }
        }

        setSearchParams(newParams);
      }

      return { ...prev, [filterId]: next };
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    setSearchParams({});
  };

  const totalActiveFilters = Object.values(selectedFilters).reduce((sum, arr) => sum + arr.length, 0);
  const filteredProducts = products;
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
              <input type="checkbox" checked={checked} onChange={() => handleFilterToggle(item.id, option)} />
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
            <div className="filter-accordion-header" onClick={() => toggleAccordion(item.id)}>
              <span>
                {item.label}
                {activeCount > 0 && <span className="filter-active-badge">{activeCount}</span>}
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
    <motion.div className="products-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">Anasayfa</Link>
        <span className="breadcrumb-separator">›</span>
        <span>{pageTitle}</span>
      </div>

      <div className="products-header">
        <h1 className="products-title">{pageTitle}</h1>
        <div className="products-header-right">
          <button className="mobile-filter-btn" onClick={() => setMobileFilterOpen(true)}>
            <SlidersHorizontal size={18} />
            <span>Filtreler</span>
            {totalActiveFilters > 0 && <span className="mobile-filter-badge">{totalActiveFilters}</span>}
          </button>

          <div className="sort-dropdown-wrap" ref={sortRef}>
            <button className="sort-dropdown" onClick={() => setSortOpen(prev => !prev)}>
              <span>{currentSortLabel}</span>
              <ChevronDown size={16} className={`sort-chevron${sortOpen ? ' open' : ''}`} />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div className="sort-menu" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                  {sortOptions.map(opt => (
                    <button
                      key={opt.value}
                      className={`sort-menu-item${sortValue === opt.value ? ' active' : ''}`}
                      onClick={() => {
                        setSortValue(opt.value);
                        setSortOpen(false);
                      }}
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
        <aside className="filters-sidebar">{sidebarContent}</aside>

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
              {filteredProducts.length === 0 ? (
                <div className="products-empty-state">
                  <span className="products-empty-badge">0 ÜRÜN</span>
                  <h3 className="products-empty-title">Ürün bulunamadı</h3>
                  <p className="products-empty-text">
                    Seçilen filtrelere uygun ürün bulunamadı. Filtreleri değiştirip tekrar deneyebilirsin.
                  </p>
                </div>
              ) : (
                <div className="products-grid">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} layoutType="grid" />
                  ))}
                </div>
              )}
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
              <div className="filter-drawer-body">{sidebarContent}</div>
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
