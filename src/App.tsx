import { useState } from 'react';
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

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'products' | 'detail' | 'login' | 'register'>('home');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const handleGoHome = () => {
    setCurrentView('home');
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        onLogoClick={handleGoHome} 
        onNavigate={(view) => {
          setCurrentView(view as any);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={totalCartItems} 
        onCartClick={() => setIsCartOpen(true)} 
        onUserClick={() => {
          setCurrentView('login');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isTransparent={currentView === 'home'}
      />
      
      {currentView === 'home' && (
        <Home onProductClick={handleProductClick} onAddToCart={handleAddToCart} />
      )}
      
      {currentView === 'products' && (
        <ProductsPage 
          key={window.location.search}
          onProductClick={handleProductClick} 
          onAddToCart={handleAddToCart} 
        />
      )}
      
      {currentView === 'detail' && (
        <ProductDetail product={selectedProduct} onBackClick={handleGoHome} onAddToCart={handleAddToCart} />
      )}

      {currentView === 'login' && (
        <Login onNavigateRegister={() => {
          setCurrentView('register');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} />
      )}

      {currentView === 'register' && (
        <Register onNavigateLogin={() => {
          setCurrentView('login');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} />
      )}

      {/* Modern Sepet Bileşeni */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
      />

      {/* Premium Footer */}
      <Footer />
    </div>
  );
}

export default App;
