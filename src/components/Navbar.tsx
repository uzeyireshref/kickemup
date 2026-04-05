import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  isOpen: boolean;
}

const navItems = [
  { label: 'YENİLER', href: '/products?sort=newest', category: 'Yeniler' },
  { label: 'SNEAKER', href: '/products?category=Sneaker', category: 'Sneaker' },
  { label: 'GİYİM', href: '/products?category=Giyim', category: 'Giyim' },
  { label: 'AKSESUAR', href: '/products?category=Aksesuar', category: 'Aksesuar' },
  { label: 'MARKALAR', href: '/products', category: 'Markalar' },
  { label: 'İNDİRİM', href: '/products?discount=true', category: 'İndirim' },
];

const Navbar = ({ isOpen }: NavbarProps) => {
  const location = useLocation();

  const activeCategory = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    const sort = params.get('sort');
    const discount = params.get('discount');

    if (discount === 'true') {
      return 'İndirim';
    }

    return category || (sort === 'newest' ? 'Yeniler' : null);
  }, [location.search]);

  return (
    <nav aria-label="Ana menü">
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
