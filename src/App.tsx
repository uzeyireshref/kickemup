import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import CartDrawer from './components/CartDrawer';
import Login from './pages/Login';
import Register from './pages/Register';
import Footer from './components/Footer';
import ProductsPage from './pages/ProductsPage';
import { supabase } from './lib/supabase';
import './index.css';

const ScrollToTop = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
};

const buildCartItemKey = (item: any) => {
  const size = item?.selectedSize || item?.size || '';
  const color = item?.selectedColor || item?.color || '';
  return `${item?.id}::${size}::${color}`;
};

const normalizeCartItems = (items: any[]) => {
  const merged = new Map<string, any>();

  items.forEach(rawItem => {
    if (!rawItem || rawItem.id === undefined || rawItem.id === null) {
      return;
    }

    const itemKey = rawItem.cartItemKey || buildCartItemKey(rawItem);
    const quantity = Number(rawItem.cartQuantity) > 0 ? Number(rawItem.cartQuantity) : 1;

    if (merged.has(itemKey)) {
      const existing = merged.get(itemKey);
      merged.set(itemKey, { ...existing, cartQuantity: existing.cartQuantity + quantity });
      return;
    }

    merged.set(itemKey, {
      ...rawItem,
      selectedSize: rawItem.selectedSize || rawItem.size || undefined,
      selectedColor: rawItem.selectedColor || rawItem.color || undefined,
      cartItemKey: itemKey,
      cartQuantity: quantity,
    });
  });

  return Array.from(merged.values());
};

const getVariantStock = (variant: any): number | null => {
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

const fetchLiveVariantStock = async (product: any) => {
  const hasVariantContext = Boolean(product?.selectedVariantId || product?.selectedSize || product?.selectedColor);
  if (!hasVariantContext || !product?.id) {
    return { stock: null as number | null, selectedVariantId: product?.selectedVariantId || undefined };
  }

  let query: any = supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', product.id);

  if (product.selectedVariantId) {
    query = query.eq('id', product.selectedVariantId);
  }
  if (product.selectedSize) {
    query = query.eq('size', product.selectedSize);
  }
  if (product.selectedColor) {
    query = query.eq('color', product.selectedColor);
  }

  const { data, error } = await query.limit(1).maybeSingle();
  if (error) throw error;

  if (!data) {
    return { stock: 0, selectedVariantId: product?.selectedVariantId || undefined };
  }

  return {
    stock: getVariantStock(data),
    selectedVariantId: data.id,
  };
};

function App() {
  const [cart, setCart] = useState<any[]>(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (!savedCart) return [];

      const parsed = JSON.parse(savedCart);
      if (!Array.isArray(parsed)) return [];
      return normalizeCartItems(parsed);
    } catch (err) {
      console.warn('Cart could not be parsed from localStorage.', err);
      return [];
    }
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = async (product: any) => {
    const nextProduct = {
      ...product,
      selectedSize: product.selectedSize || product.size || undefined,
      selectedColor: product.selectedColor || product.color || undefined,
    };
    const itemKey = buildCartItemKey(nextProduct);

    let maxStock: number | null = nextProduct.maxStock ?? null;
    let selectedVariantId = nextProduct.selectedVariantId;

    try {
      const liveStock = await fetchLiveVariantStock(nextProduct);
      if (liveStock.stock !== null) {
        maxStock = liveStock.stock;
      }
      if (liveStock.selectedVariantId) {
        selectedVariantId = liveStock.selectedVariantId;
      }
    } catch (err) {
      console.error('Stock check error while adding to cart:', err);
      showToast('Stok bilgisi alınamadı. Lütfen tekrar deneyin.');
      return;
    }

    let stockBlocked = false;

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.cartItemKey === itemKey);
      const currentQty = existingIndex >= 0 ? (prev[existingIndex].cartQuantity || 1) : 0;

      if (maxStock !== null && currentQty + 1 > maxStock) {
        stockBlocked = true;
        return prev;
      }

      if (existingIndex >= 0) {
        const newCart = [...prev];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          selectedVariantId: selectedVariantId || newCart[existingIndex].selectedVariantId,
          maxStock: maxStock ?? newCart[existingIndex].maxStock,
          cartQuantity: currentQty + 1
        };
        return newCart;
      }

      return [
        ...prev,
        {
          ...nextProduct,
          selectedVariantId,
          maxStock,
          cartItemKey: itemKey,
          cartQuantity: 1
        }
      ];
    });

    if (stockBlocked) {
      showToast('Üzgünüz, bu ürün tükendi');
      return;
    }

    showToast(`1 x "${product.name}" sepete eklendi.`);
  };

  const handleUpdateQuantity = async (cartItemKey: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(prev => prev.filter(item => item.cartItemKey !== cartItemKey));
      return;
    }

    const cartItem = cart.find(item => item.cartItemKey === cartItemKey);
    if (!cartItem) return;

    let maxStock: number | null = cartItem.maxStock ?? null;
    let selectedVariantId = cartItem.selectedVariantId;
    const currentQty = cartItem.cartQuantity || 1;
    const isIncreasing = newQuantity > currentQty;

    if (isIncreasing) {
      try {
        const liveStock = await fetchLiveVariantStock(cartItem);
        if (liveStock.stock !== null) {
          maxStock = liveStock.stock;
        }
        if (liveStock.selectedVariantId) {
          selectedVariantId = liveStock.selectedVariantId;
        }
      } catch (err) {
        console.error('Stock check error while updating quantity:', err);
        showToast('Stok bilgisi alınamadı. Lütfen tekrar deneyin.');
        return;
      }
    }

    if (maxStock !== null && newQuantity > maxStock) {
      setCart(prev => prev.map(item => (
        item.cartItemKey === cartItemKey
          ? { ...item, maxStock, selectedVariantId: selectedVariantId || item.selectedVariantId }
          : item
      )));
      showToast('Üzgünüz, bu ürün tükendi');
      return;
    }

    setCart(prev => prev.map(item => (
      item.cartItemKey === cartItemKey
        ? {
          ...item,
          maxStock: maxStock ?? item.maxStock,
          selectedVariantId: selectedVariantId || item.selectedVariantId,
          cartQuantity: newQuantity
        }
        : item
    )));
  };

  const handleRemoveFromCart = (cartItemKey: string) => {
    setCart(prev => prev.filter(item => item.cartItemKey !== cartItemKey));
  };

  const totalCartItems = cart.reduce((sum, item) => sum + (item.cartQuantity || 1), 0);

  return (
    <Router>
      <ScrollToTop />
      <div className="app-container">
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -40, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              style={{
                position: 'fixed',
                top: '80px',
                left: '50%',
                backgroundColor: '#111',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '50px',
                zIndex: 9999,
                fontSize: '0.9rem',
                fontWeight: 500,
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                pointerEvents: 'none',
                maxWidth: '90%',
                textAlign: 'center'
              }}
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <Header
          cartCount={totalCartItems}
          onCartClick={() => setIsCartOpen(true)}
        />

        <Routes>
          <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
          <Route path="/products" element={<ProductsPage onAddToCart={handleAddToCart} />} />
          <Route path="/product/:slug" element={<ProductDetail onAddToCart={handleAddToCart} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cart}
          onRemoveItem={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateQuantity}
        />

        <Footer />
      </div>
    </Router>
  );
}

export default App;
