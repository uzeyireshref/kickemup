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

  // Güvenlik: ürün null ise örnek veriyle doldur
  const p = product || {
    brand: "Carhartt WIP",
    name: "W' Olney Michigan Coat 'Black'",
    price: "₺ 13,100.00",
    image: "https://images.unsplash.com/photo-1559551409-dadc959f76b8?auto=format&fit=crop&q=80&w=1000",
    id: "I035320_89_XX"
  };

  return (
    <div className="product-detail-page">
      <div className="breadcrumb">
        <span style={{cursor: 'pointer'}} onClick={onBackClick}>Ana Sayfa</span>
        <span className="separator">{'>'}</span>
        <span style={{cursor: 'pointer'}}>Giyim Koleksiyonu</span>
        <span className="separator">{'>'}</span>
        <span className="current">{p.name}</span>
      </div>

      <div className="product-detail-container">
        {/* Sol Sütun - Dev Görsel */}
        <div className="product-image-section">
          <div className="main-image-container">
            <button className="wishlist-btn" aria-label="Favorilere Ekle">
              <Heart size={26} strokeWidth={1.5} color="#000" />
            </button>
            <img 
              src={p.image}
              alt={p.name} 
              className="detail-main-image"
            />
          </div>
        </div>

        {/* Sağ Sütun - Bilgiler */}
        <div className="product-info-section">
          <h1 className="detail-brand">{p.brand}</h1>
          <h2 className="detail-name">{p.name}</h2>
          
          <div className="detail-price">{p.price}</div>
          <div className="detail-code">Ürün Kodu: {p.id || "I035320_89_XX"}</div>

          <div className="size-selector">
            <button className="size-btn out-of-stock" disabled>
               <span className="strike"></span>
               XS
            </button>
            <button 
              className={`size-btn ${selectedSize === 'S' ? 'selected' : ''}`}
              onClick={() => setSelectedSize('S')}
            >S</button>
            <button 
              className={`size-btn ${selectedSize === 'M' ? 'selected' : ''}`}
              onClick={() => setSelectedSize('M')}
            >M</button>
            <button 
              className={`size-btn ${selectedSize === 'L' ? 'selected' : ''}`}
              onClick={() => setSelectedSize('L')}
            >L</button>
          </div>

          <button 
            className="add-to-cart-mega" 
            onClick={() => onAddToCart && onAddToCart(p)}
          >
            SEPETE EKLE
          </button>

          {/* Akordeon */}
          <div className="product-accordion">
            <div className="accordion-item">
              <button 
                className="accordion-header"
                onClick={() => setIsStockOpen(!isStockOpen)}
              >
                <div className="accordion-title">
                  <span className="icon-map" style={{fontSize: '18px', fontWeight: '300'}}>◎</span> Mağaza Stok Durumu
                </div>
                {isStockOpen ? <Minus size={20} strokeWidth={1.5}/> : <Plus size={20} strokeWidth={1.5} />}
              </button>
              {isStockOpen && (
                <div className="accordion-content">
                  <p>Şu an web stoğu mevcuttur.</p>
                </div>
              )}
            </div>

            <div className="accordion-item">
              <button 
                className="accordion-header"
                onClick={() => setIsDescOpen(!isDescOpen)}
              >
                <div className="accordion-title">Ürün Açıklaması</div>
                {isDescOpen ? <X size={20} strokeWidth={1.5} /> : <Plus size={20} strokeWidth={1.5} />}
              </button>
              {isDescOpen && (
                <div className="accordion-content">
                  <p>
                    Carhartt W' Olney Michigan Coat 'Black', ağır gramajlı suni kürk dış yüzeyi ve pürüzsüz
                    naylon tafta astarıyla yüksek konfor ve sıcaklık sunar. Fonksiyonel tasarımı sayesinde
                    ön kısımda dört cep bulunur; bunlardan biri kapaklı ve düğmeli yapısıyla ekstra güvenlik
                    sağlar. Model, stil ve işlevselliği bir araya getiren dokuma Square Label etiketiyle tamamlanır.
                  </p>
                  <p className="features-title">Ürün Özellikleri:</p>
                  <ul>
                    <li>%100 polyester dış yüzey</li>
                    <li>%100 naylon astar</li>
                    <li>Ağır gramajlı suni kürk yapı</li>
                  </ul>
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
