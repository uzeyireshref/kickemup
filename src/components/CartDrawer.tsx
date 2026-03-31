import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import './CartDrawer.css';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: any[];
  onRemoveItem: (id: string | number) => void;
  onUpdateQuantity: (id: string | number, qty: number) => void;
}

const CartDrawer = ({ isOpen, onClose, cartItems, onRemoveItem, onUpdateQuantity }: CartDrawerProps) => {
  // Fiyatı saf sayıya çevirip toplama işlevi ("₺ 13,100.00" -> 13100)
  const calculateTotal = () => {
    let total = 0;
    cartItems.forEach(item => {
      let price = 0;
      if (typeof item.price === 'number') {
        price = item.price;
      } else {
        const priceStr = String(item.price).replace(/[^\d.,]/g, '').replace(/,/g, '');
        const parsed = parseFloat(priceStr);
        if (!isNaN(parsed)) {
          price = parsed;
        }
      }
      total += price * (item.cartQuantity || 1);
    });
    return total;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Siyah Yarı Saydam Zemin (Overlay) */}
          <motion.div 
            className="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Sepet Paneli (Drawer) */}
          <motion.div 
            className="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
          >
            <div className="cart-header">
              <h2>Sepetiniz ({cartItems.length})</h2>
              <button onClick={onClose} className="cart-close-btn" aria-label="Kapat">
                <X size={24} color="#000" strokeWidth={1.5} />
              </button>
            </div>

            <div className="cart-items-container">
              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <p>Sepetiniz şu an boş.</p>
                  <button className="continue-shopping" onClick={onClose}>Alışverişe Devam Et</button>
                </div>
              ) : (
                cartItems.map((item, index) => {
                  const brandName = item.brands?.name || item.brand || 'Ürün';
                  const displayImage = item.product_images?.[0]?.url || item.image_url || item.image || '';
                  const displayPrice = typeof item.price === 'number' 
                    ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(item.price)
                    : item.price;

                  return (
                    <div key={`${item.id}-${index}`} className="cart-item">
                      <img src={displayImage} alt={item.name} className="cart-item-image" />
                      <div className="cart-item-info">
                        <span className="cart-item-brand">{brandName}</span>
                        <h4 className="cart-item-name">{item.name}</h4>
                        <div className="cart-item-price">{displayPrice}</div>
                        
                        {/* Miktar Kontrolleri */}
                        <div className="cart-item-quantity">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, (item.cartQuantity || 1) - 1)}
                            className="qty-btn"
                            aria-label="Azalt"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="qty-value">{item.cartQuantity || 1}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, (item.cartQuantity || 1) + 1)}
                            className="qty-btn"
                            aria-label="Artır"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      <button 
                        className="cart-item-remove" 
                        onClick={() => onRemoveItem(item.id)}
                        aria-label="Ürünü Sil"
                      >
                        <Trash2 size={18} strokeWidth={1.5} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Toplam</span>
                  {/* Amerikan veya yerel paraya uyumlu gösterme */}
                  <span>₺ {calculateTotal().toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
                <button className="checkout-btn">
                  SİPARİŞİ TAMAMLA
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
