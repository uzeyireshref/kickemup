import { useState, useEffect } from 'react';
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
import './index.css';

// ScrollToTop component to ensure pages start at the top on navigation
const ScrollToTop = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
};

function App() {
  const [cart, setCart] = useState<any[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (product: any) => {
    setCart(prev => {
      const existingKey = `${product.id}`;
      const existingIndex = prev.findIndex(item => `${item.id}` === existingKey);
      if (existingIndex >= 0) {
        const newCart = [...prev];
        newCart[existingIndex] = { ...newCart[existingIndex], cartQuantity: (newCart[existingIndex].cartQuantity || 1) + 1 };
        return newCart;
      }
      return [...prev, { ...product, cartQuantity: 1 }];
    });

    setToastMessage(`1 x "${product.name}" sepete eklendi.`);
    
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleUpdateQuantity = (productId: string | number, newQuantity: number) => {
    setCart(prev => {
      if (newQuantity <= 0) {
        return prev.filter(item => item.id !== productId);
      }
      return prev.map(item => 
        item.id === productId ? { ...item, cartQuantity: newQuantity } : item
      );
    });
  };

  const handleRemoveFromCart = (productId: string | number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const totalCartItems = cart.reduce((sum, item) => sum + (item.cartQuantity || 1), 0);

  return (
    <Router>
      <ScrollToTop />
      <div className="app-container">
        {/* Zarif Toast Bildirimi */}
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
              ✓ {toastMessage}
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
