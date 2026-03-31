import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { ShoppingBag, Menu as MenuIcon, X, User, Search } from 'lucide-react';
import './Header.css';

interface HeaderProps {
  cartCount?: number;
  onCartClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  cartCount = 0, 
  onCartClick
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Transparency logic synchronized with current path
  const isHome = location.pathname === '/';
  const headerClass = (isHome && !isScrolled) ? 'transparent' : 'scrolled';

  return (
    <header className={`header ${headerClass}`}>
      <div className="header-left">
        <Link to="/" className="logo">KICKEMUP</Link>
        <Navbar isOpen={isMenuOpen} />
      </div>
      
      <div className="header-right">
        <div className="header-search">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Ürün, Marka veya Kategori ara" />
        </div>
        
        <div className="header-actions">
          <button className="cart-btn mobile-search-btn" aria-label="Arama">
            <Search size={24} strokeWidth={1.5} className="cart-icon" />
          </button>
          <Link to="/login" className="cart-btn" aria-label="Hesabım">
            <User size={24} strokeWidth={1.5} className="cart-icon" />
          </Link>
          <button className="cart-btn" aria-label="Sepet" onClick={onCartClick}>
            <div style={{ position: 'relative', display: 'flex' }}>
              <ShoppingBag size={24} strokeWidth={1.5} className="cart-icon" />
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </div>
          </button>
          <button className="menu-btn" onClick={toggleMenu} aria-label="Menü">
            {isMenuOpen ? (
              <X size={24} className="menu-icon" />
            ) : (
              <MenuIcon size={24} className="menu-icon" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
