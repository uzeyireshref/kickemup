import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Plus, Minus, X, Loader2 } from 'lucide-react';
import FavoriteAuthModal from '../components/FavoriteAuthModal';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../hooks/useFavorites';
import { formatCurrency, getPriceDisplayData } from '../lib/pricing';
import { supabase } from '../lib/supabase';
import type { CartItem } from '../types/cart';
import type { ProductData, ProductVariant } from '../types/product';
import './ProductDetail.css';

interface ProductDetailProps {
  onAddToCart?: (product: CartItem) => void;
}

const getVariantStock = (variant: ProductVariant | null | undefined): number | null => {
  if (!variant) return null;

  const candidates = [variant.stock, variant.quantity, variant.stock_quantity];
  for (const candidate of candidates) {
    const numeric = Number(candidate);
    if (Number.isFinite(numeric)) {
      return Math.max(0, numeric);
    }
  }

  return null;
};

const ProductDetail: React.FC<ProductDetailProps> = ({ onAddToCart }) => {
  const { slug } = useParams<{ slug: string }>();
  const [selectedSize, setSelectedSize] = useState('M');
  const [isDescOpen, setIsDescOpen] = useState(true);
  const [isStockOpen, setIsStockOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { isFavorite, isPending, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (!slug) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*, brands(name), product_images(url), categories(name), product_variants(*)')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        const productData = data as ProductData;
        setProduct(productData);

        if (Array.isArray(productData.product_variants) && productData.product_variants.length > 0) {
          const firstSize = productData.product_variants.find((variant: ProductVariant) => variant.size)?.size;
          if (firstSize) setSelectedSize(firstSize);
        }
      } catch (err) {
        console.error('Detail fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="product-detail-page loading-center">
        <Loader2 className="spinning" size={50} />
        <p>Ürün Detayları Yükleniyor...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <p>Ürün bulunamadı.</p>
          <Link to="/" className="add-to-cart-mega" style={{ display: 'inline-block', width: 'auto', padding: '10px 40px' }}>
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  const brandName = product.brands?.name || product.brand || 'KickEmUp';
  const displayImage = product.product_images?.[0]?.url || product.image_url || product.image;
  const priceData = getPriceDisplayData(product.price, product.discount_percentage);
  const favoriteActive = isFavorite(product.id);
  const favoritePending = isPending(product.id);

  const variants: ProductVariant[] = Array.isArray(product.product_variants) ? product.product_variants : [];
  const hasSizedVariants = variants.some((variant) => variant.size);
  const sizeList = hasSizedVariants
    ? Array.from(new Set(variants.flatMap((variant) => (variant.size ? [variant.size] : []))))
    : [];

  const getSizeStock = (size: string) => {
    const matching = variants.filter((variant) => variant.size === size);
    if (matching.length === 0) return null;

    const values: number[] = matching
      .map(getVariantStock)
      .filter((value: number | null): value is number => value !== null);

    if (values.length === 0) return null;
    return values.reduce((sum: number, value: number) => sum + value, 0);
  };

  const selectedSizeStock = hasSizedVariants ? getSizeStock(selectedSize) : getVariantStock(variants[0]);
  const isSelectedOutOfStock = selectedSizeStock !== null && selectedSizeStock <= 0;
  const isLowStock = selectedSizeStock !== null && selectedSizeStock > 0 && selectedSizeStock < 5;

  const selectedVariant = hasSizedVariants
    ? (
      variants.find((variant) => variant.size === selectedSize && (getVariantStock(variant) ?? 0) > 0)
      || variants.find((variant) => variant.size === selectedSize)
    )
    : variants[0];

  const handleFavoriteToggle = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      await toggleFavorite(product.id);
    } catch (error) {
      console.error('Product detail favorite error:', error);
    }
  };

  return (
    <>
      <div className="product-detail-page">
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">Ana Sayfa</Link>
        <span className="separator">{'>'}</span>
        <Link to={`/products?category=${product.categories?.name}`} className="breadcrumb-link">
          {product.categories?.name || 'Koleksiyon'}
        </Link>
        <span className="separator">{'>'}</span>
        <span className="current">{product.name}</span>
      </div>

      <div className="product-detail-container">
        <div className="product-image-section">
          <div className="main-image-container">
            <button
              type="button"
              className={`wishlist-btn${favoriteActive ? ' is-active' : ''}`}
              aria-label={favoriteActive ? 'Favorilerden çıkar' : 'Favorilere ekle'}
              aria-pressed={favoriteActive}
              disabled={favoritePending}
              onClick={handleFavoriteToggle}
            >
              <Heart
                size={26}
                fill={favoriteActive ? '#c81d3a' : 'none'}
                stroke={favoriteActive ? '#c81d3a' : '#111'}
                strokeWidth={1.5}
                absoluteStrokeWidth
              />
            </button>
            <img src={displayImage} alt={product.name} className="detail-main-image" />
          </div>
        </div>

        <div className="product-info-section">
          <h1 className="detail-brand">{brandName}</h1>
          <h2 className="detail-name">{product.name}</h2>

          <div className="detail-price-block">
            {priceData.hasDiscount && (
              <span className="detail-discount-chip">-%{priceData.discountPercentage}</span>
            )}
            <div className="detail-price-row">
              {priceData.hasDiscount && (
                <span className="detail-price-old">{formatCurrency(priceData.originalPrice)}</span>
              )}
              <div className={`detail-price${priceData.hasDiscount ? ' discounted' : ''}`}>
                {formatCurrency(priceData.discountedPrice)}
              </div>
            </div>
          </div>
          <div className="detail-code">Sürüm: {product.slug}</div>

          <div className="size-selector">
            {hasSizedVariants ? (
              sizeList.map((size) => {
                const sizeStock = getSizeStock(size);
                const outOfStock = sizeStock !== null && sizeStock <= 0;

                return (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'selected' : ''} ${outOfStock ? 'out-of-stock' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                    {outOfStock && <span className="strike" />}
                  </button>
                );
              })
            ) : (
              <p className="no-variants">Bu ürün için beden bilgisi bulunmamaktadır.</p>
            )}
          </div>

          {isLowStock && (
            <p className="stock-scarcity">Son {selectedSizeStock} adet!</p>
          )}

          <button
            className="add-to-cart-mega"
            disabled={isSelectedOutOfStock}
            onClick={() => {
              if (!onAddToCart) return;
              const cartPayload: CartItem = hasSizedVariants
                ? {
                  ...product,
                  selectedSize,
                  selectedVariantId: selectedVariant?.id ?? null,
                  maxStock: selectedSizeStock
                }
                : product;
              onAddToCart(cartPayload);
            }}
          >
            {isSelectedOutOfStock ? 'Tükendi' : 'SEPETE EKLE'}
          </button>

          <div className="product-accordion">
            <div className="accordion-item">
              <button className="accordion-header" onClick={() => setIsStockOpen(!isStockOpen)}>
                <div className="accordion-title">◍ Mağaza Stok Durumu</div>
                {isStockOpen ? <Minus size={20} /> : <Plus size={20} />}
              </button>
              {isStockOpen && <div className="accordion-content"><p>Web stoğu mevcuttur.</p></div>}
            </div>

            <div className="accordion-item">
              <button className="accordion-header" onClick={() => setIsDescOpen(!isDescOpen)}>
                <div className="accordion-title">Ürün Açıklaması</div>
                {isDescOpen ? <X size={20} /> : <Plus size={20} />}
              </button>
              {isDescOpen && (
                <div className="accordion-content">
                  <p>{product.description || 'Bu ürün hakkında henüz bir açıklama eklenmemiş.'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
      <FavoriteAuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default ProductDetail;
