import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  isOpen: boolean;
}

const Navbar = ({ isOpen }: NavbarProps) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    const sort = params.get('sort');
    setActiveCategory(cat || (sort === 'newest' ? 'Yeniler' : null));
  }, [location.search]);

  const navItems = [
    { label: 'YENİLER', href: '/products?sort=newest', category: 'Yeniler' },
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
            <Link to={item.href} className={`nav-link ${activeCategory === item.category ? 'active' : ''}`}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
