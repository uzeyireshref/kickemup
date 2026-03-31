import React from 'react';

interface NavbarProps {
  isOpen: boolean;
  onNavigate?: (view: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isOpen, onNavigate }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('products');
    }
  };

  return (
    <nav>
      <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
        <li><a href="#new" onClick={handleClick} className="nav-link">YENİLER</a></li>
        <li><a href="#sneaker" onClick={handleClick} className="nav-link">SNEAKER</a></li>
        <li><a href="#apparel" onClick={handleClick} className="nav-link">GİYİM</a></li>
        <li><a href="#accessories" onClick={handleClick} className="nav-link">AKSESUAR</a></li>
        <li><a href="#brands" onClick={handleClick} className="nav-link">MARKALAR</a></li>
        <li><a href="#sale" onClick={handleClick} className="nav-link">İNDİRİM</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
