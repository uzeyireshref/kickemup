import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem } from '../types/cart';
import './Cart.css';

interface CartPageProps {
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

const Cart = ({ cartItems, onRemoveItem, onUpdateQuantity }: CartPageProps) => {
  const total = cartItems.reduce((sum, item) => {
    return sum + parsePrice(item.price) * (item.cartQuantity || 1);
  }, 0);

  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <div className="cart-empty">
          <h1>Sepetin şu an boş</h1>
          <p>Favori ürünlerini ekleyerek alışverişe başlayabilirsin.</p>
          <Link className="cart-back-btn" to="/products">Alışverişe Dön</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-header-row">
        <h1>Sepetim</h1>
        <span>{cartItems.length} ürün</span>
      </div>

      <div className="cart-layout">
        <section className="cart-items">
          {cartItems.map((item) => {
            const itemKey = getCartItemKey(item);
            const quantity = item.cartQuantity || 1;
            const displayImage = item.product_images?.[0]?.url || item.image_url || item.image || '';
            const brandName = item.brands?.name || item.brand || 'Ürün';
            const maxStock = Number.isFinite(Number(item.maxStock)) ? Number(item.maxStock) : null;
            const disableIncrease = maxStock !== null && quantity >= maxStock;
            const linePrice = parsePrice(item.price) * quantity;

            return (
              <article className="cart-item-row" key={itemKey}>
                <img src={displayImage} alt={String(item.name ?? 'Ürün')} />
                <div className="cart-item-content">
                  <span className="cart-brand">{brandName}</span>
                  <h2>{item.name}</h2>
                  {item.selectedSize && <p>Beden: {item.selectedSize}</p>}
                  <div className="cart-controls">
                    <button onClick={() => onUpdateQuantity(itemKey, quantity - 1)} aria-label="Azalt">
                      <Minus size={14} />
                    </button>
                    <span>{quantity}</span>
                    <button onClick={() => onUpdateQuantity(itemKey, quantity + 1)} disabled={disableIncrease} aria-label="Artır">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <div className="cart-item-side">
                  <strong>{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(linePrice)}</strong>
                  <button onClick={() => onRemoveItem(itemKey)} aria-label="Sil">
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        <aside className="cart-summary">
          <h3>Sipariş Özeti</h3>
          <div className="cart-summary-row">
            <span>Ara Toplam</span>
            <strong>{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(total)}</strong>
          </div>
          <p>Kargo ve indirimler ödeme adımında hesaplanır.</p>
          <button>Siparişi Tamamla</button>
        </aside>
      </div>
    </main>
  );
};

export default Cart;
