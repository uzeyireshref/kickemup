import React, { useState, useEffect } from 'react';
import { Heart, Plus, Minus, X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './ProductDetail.css';

interface ProductDetailProps {
  productId?: string | number;
  product?: any; // Can be full object from list or just ID
  onBackClick?: () => void;
  onAddToCart?: (product: any) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId, product: propProduct, onBackClick, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState('M');
  const [isDescOpen, setIsDescOpen] = useState(true);
  const [isStockOpen, setIsStockOpen] = useState(false);
  const [product, setProduct] = useState<any>(propProduct || null);
  const [loading, setLoading] = useState(!propProduct);

  const idToFetch = productId || propProduct?.id;

  useEffect(() => {
    if (!idToFetch) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*, brands(name), product_images(url), categories(name)')
          .eq('id', idToFetch)
          .single();
        
        if (error) throw error;
        setProduct(data);
      } catch (err) {
        console.error('Detail fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we don't have the full object or if we want to refresh
    if (idToFetch) fetchDetail();
  }, [idToFetch]);

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
        <p>Ürün bulunamadı.</p>
        <button onClick={onBackClick}>Geri Dön</button>
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
        <span style={{cursor: 'pointer'}} onClick={onBackClick}>Ana Sayfa</span>
        <span className="separator">{'>'}</span>
        <span style={{cursor: 'pointer'}}>{product.categories?.name || 'Koleksiyon'}</span>
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
          <div className="detail-code">Ürün Kodu: {product.id}</div>

          <div className="size-selector">
            {/* Dinamik Beden Listesi */}
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

/*
ORIGINAL BACKUP:
import React, { useState } from 'react';
import { Heart, Plus, Minus, X } from 'lucide-react';
import './ProductDetail.css';

interface ProductDetailProps {
  product?: any;
  onBackClick?: () => void;
  onAddToCart?: (product: any) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBackClick, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState('M');
  const [isDescOpen, setIsDescOpen] = useState(true);
  const [isStockOpen, setIsStockOpen] = useState(false);

  const p = product || {
    brand: "Carhartt WIP",
    name: "W' Olney Michigan Coat 'Black'",
    price: "₺ 13,100.00",
    image: "https://images.unsplash.com/photo-1559551409-dadc959f76b8?auto=format&fit=crop&q=80&w=1000",
    id: "I035320_89_XX"
  };

  return (
    <div className="product-detail-page">
       ... (UI Content)
    </div>
  );
};

export default ProductDetail;
*/
