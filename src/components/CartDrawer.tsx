import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import type { CartItem } from '../types/cart';
import './CartDrawer.css';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (cartItemKey: string) => void;
  onUpdateQuantity: (cartItemKey: string, qty: number) => void;
}

const getCartItemKey = (item: CartItem) => {
  if (item?.cartItemKey) return item.cartItemKey;
  const size = item?.selectedSize || item?.size || '';
  const color = item?.selectedColor || item?.color || '';
  return `${item?.id}::${size}::${color}`;
};

const parsePrice = (value: unknown) => {
  if (typeof value === 'number') return value;
  const raw = String(value ?? '').trim();
  if (!raw) return 0;

  const cleaned = raw.replace(/[^\d.,-]/g, '');
  if (!cleaned) return 0;

  const hasDot = cleaned.includes('.');
  const hasComma = cleaned.includes(',');

  let normalized = cleaned;
  if (hasDot && hasComma) {
    const lastComma = cleaned.lastIndexOf(',');
    const lastDot = cleaned.lastIndexOf('.');
    normalized = lastComma > lastDot
      ? cleaned.replace(/\./g, '').replace(',', '.')
      : cleaned.replace(/,/g, '');
  } else if (hasComma) {
    normalized = cleaned.replace(',', '.');
  }

  const parsed = parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const CartDrawer = ({ isOpen, onClose, cartItems, onRemoveItem, onUpdateQuantity }: CartDrawerProps) => {
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + parsePrice(item.price) * (item.cartQuantity || 1), 0);
  };

  const totalQuantity = cartItems.reduce((sum, item) => sum + (item.cartQuantity || 1), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
          >
            <div className="cart-header">
              <h2>Sepetin ({totalQuantity})</h2>
              <button onClick={onClose} className="cart-close-btn" aria-label="Kapat">
                <X size={24} color="#000" strokeWidth={1.5} />
              </button>
            </div>

            <div className="cart-items-container">
              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <p>Sepetin şu an boş.</p>
                  <button className="continue-shopping" onClick={onClose}>Alışverişe Devam Et</button>
                </div>
              ) : (
                cartItems.map((item) => {
                  const cartItemKey = getCartItemKey(item);
                  const brandName = item.brands?.name || item.brand || 'Ürün';
                  const displayImage = item.product_images?.[0]?.url || item.image_url || item.image || '';
                  const displayPrice = typeof item.price === 'number'
                    ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(item.price)
                    : item.price;
                  const maxStock = Number.isFinite(Number(item.maxStock)) ? Number(item.maxStock) : null;
                  const disableIncrease = maxStock !== null && (item.cartQuantity || 1) >= maxStock;

                  return (
                    <div key={cartItemKey} className="cart-item">
                      <img src={displayImage} alt={item.name} className="cart-item-image" />
                      <div className="cart-item-info">
                        <span className="cart-item-brand">{brandName}</span>
                        <h4 className="cart-item-name">{item.name}</h4>
                        {item.selectedSize && <div className="cart-item-brand">Beden: {item.selectedSize}</div>}
                        <div className="cart-item-price">{displayPrice}</div>

                        <div className="cart-item-quantity">
                          <button onClick={() => onUpdateQuantity(cartItemKey, (item.cartQuantity || 1) - 1)} className="qty-btn" aria-label="Azalt">
                            <Minus size={14} />
                          </button>
                          <span className="qty-value">{item.cartQuantity || 1}</span>
                          <button
                            onClick={() => onUpdateQuantity(cartItemKey, (item.cartQuantity || 1) + 1)}
                            className="qty-btn"
                            aria-label="Artır"
                            disabled={disableIncrease}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      <button className="cart-item-remove" onClick={() => onRemoveItem(cartItemKey)} aria-label="Ürünü Sil">
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
                  <span>{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(calculateTotal())}</span>
                </div>
                <Link className="checkout-btn" to="/cart" onClick={onClose}>Siparişi Tamamla</Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;

