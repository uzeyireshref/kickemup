import { useEffect, useState } from 'react';

interface NavbarProps {
  isOpen: boolean;
  onNavigate?: (view: string) => void;
}

const Navbar = ({ isOpen, onNavigate }: NavbarProps) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      const sort = params.get('sort');
      setActiveCategory(cat || (sort === 'newest' ? 'Yeniler' : null));
    };

    window.addEventListener('popstate', handleUrlChange);
    handleUrlChange();

    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, category: string, sort?: string) => {
    e.preventDefault();
    const url = new URL(window.location.origin + '/products');
    if (category && category !== 'Yeniler') url.searchParams.set('category', category);
    if (sort) url.searchParams.set('sort', sort);
    
    window.history.pushState({}, '', url.toString());
    window.dispatchEvent(new PopStateEvent('popstate'));
    
    if (onNavigate) onNavigate('products');
  };

  const navItems = [
    { label: 'YENİLER', href: '/products?sort=newest', category: 'Yeniler', sort: 'newest' },
    { label: 'SNEAKER', href: '/products?category=Sneaker', category: 'Sneaker' },
    { label: 'GİYİM', href: '/products?category=Giyim', category: 'Giyim' },
    { label: 'AKSESUAR', href: '/products?category=Aksesuar', category: 'Aksesuar' },
    { label: 'MARKALAR', href: '/products', category: 'Markalar' },
    { label: 'İNDİRİM', href: '/products', category: 'İndirim' }
  ];

  return (
    <nav>
      <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
        {navItems.map((item) => (
          <li key={item.label}>
            <a 
              href={item.href} 
              onClick={(e) => handleLinkClick(e, item.category, item.sort)}
              className={`nav-link ${activeCategory === item.category ? 'active' : ''}`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;

/*
ORIGINAL BACKUP:
import type { MouseEvent } from 'react';

interface NavbarProps {
  isOpen: boolean;
  onNavigate?: (view: string) => void;
}

const Navbar = ({ isOpen, onNavigate }: NavbarProps) => {
  const handleClick = (e: MouseEvent) => {
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
*/
