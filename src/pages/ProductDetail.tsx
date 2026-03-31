import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Plus, Minus, X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './ProductDetail.css';

interface ProductDetailProps {
  onAddToCart?: (product: any) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ onAddToCart }) => {
  const { slug } = useParams<{ slug: string }>();
  const [selectedSize, setSelectedSize] = useState('M');
  const [isDescOpen, setIsDescOpen] = useState(true);
  const [isStockOpen, setIsStockOpen] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
        setProduct(data);
        
        if (data.product_variants && data.product_variants.length > 0) {
          const firstSize = data.product_variants.find((v: any) => v.size)?.size;
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
          <Link to="/" className="add-to-cart-mega" style={{ display: 'inline-block', width: 'auto', padding: '10px 40px' }}>Ana Sayfaya Dön</Link>
        </div>
      </div>
    );
  }

  const brandName = product.brands?.name || product.brand || 'KickEmUp';
  const displayImage = product.product_images?.[0]?.url || product.image_url || product.image;
  const displayPrice = typeof product.price === 'number'
    ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(product.price)
    : product.price;

  return (
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
            <button className="wishlist-btn" aria-label="Favorilere Ekle">
              <Heart size={26} strokeWidth={1.5} color="#000" />
            </button>
            <img 
              src={displayImage}
              alt={product.name} 
              className="detail-main-image"
            />
          </div>
        </div>

        <div className="product-info-section">
          <h1 className="detail-brand">{brandName}</h1>
          <h2 className="detail-name">{product.name}</h2>
          
          <div className="detail-price">{displayPrice}</div>
          <div className="detail-code">Sürüm: {product.slug}</div>

          <div className="size-selector">
            {product.product_variants && product.product_variants.some((v: any) => v.size) ? (
              Array.from(new Set(product.product_variants.filter((v: any) => v.size).map((v: any) => v.size)))
                .map((size: any) => (
                  <button 
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))
            ) : (
              <p className="no-variants">Bu ürün için beden bilgisi bulunmamaktadır.</p>
            )}
          </div>

          <button 
            className="add-to-cart-mega" 
            onClick={() => onAddToCart && onAddToCart(product)}
          >
            SEPETE EKLE
          </button>

          <div className="product-accordion">
            <div className="accordion-item">
              <button className="accordion-header" onClick={() => setIsStockOpen(!isStockOpen)}>
                <div className="accordion-title">◎ Mağaza Stok Durumu</div>
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
  );
};

export default ProductDetail;
