import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { ShoppingBag, Menu as MenuIcon, X, User, Search } from 'lucide-react';
import './Header.css';

interface HeaderProps {
  onLogoClick?: () => void;
  onNavigate?: (view: string) => void;
  cartCount?: number;
  onCartClick?: () => void;
  onUserClick?: () => void;
  isTransparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  onLogoClick, 
  onNavigate,
  cartCount = 0, 
  onCartClick, 
  onUserClick,
  isTransparent = false
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const headerClass = (isTransparent && !isScrolled) ? 'transparent' : 'scrolled';

  return (
    <header className={`header ${headerClass}`}>
      <div className="header-left">
        <div className="logo" onClick={onLogoClick} style={{ cursor: 'pointer' }}>KICKEMUP</div>
        <Navbar isOpen={isMenuOpen} onNavigate={onNavigate} />
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
          <button className="cart-btn" aria-label="Hesabım" onClick={onUserClick}>
            <User size={24} strokeWidth={1.5} className="cart-icon" />
          </button>
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
