import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ChevronRight,
  Menu as MenuIcon,
  Package,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Navbar from './Navbar';
import './Header.css';

interface HeaderProps {
  cartCount?: number;
  onCartClick?: () => void;
}

type AccountSectionKey = 'orders' | 'addresses' | 'favorites' | 'profile' | 'raffles';

const DEFAULT_ACCOUNT_SECTION: AccountSectionKey = 'profile';

const ACCOUNT_SECTIONS: Array<{
  key: AccountSectionKey;
  dropdownLabel: string;
}> = [
  { key: 'orders', dropdownLabel: 'Siparişlerim' },
  { key: 'addresses', dropdownLabel: 'Adres ve Fatura Bilgilerim' },
  { key: 'favorites', dropdownLabel: 'Favori Ürünlerim' },
  { key: 'profile', dropdownLabel: 'Profilim' },
  { key: 'raffles', dropdownLabel: 'Raffle Katılımlarım' },
];

const MOBILE_NAV_ITEMS = [
  { label: 'YENİLER', href: '/products?sort=newest' },
  { label: 'SNEAKER', href: '/products?category=Sneaker' },
  { label: 'GİYİM', href: '/products?category=Giyim' },
  { label: 'AKSESUAR', href: '/products?category=Aksesuar' },
  { label: 'MARKALAR', href: '/products' },
  { label: 'İNDİRİM', href: '/products?discount=true' },
];

const readString = (value: unknown) => (typeof value === 'string' ? value : '');

const isAccountSectionKey = (value: string | null): value is AccountSectionKey => (
  ACCOUNT_SECTIONS.some((section) => section.key === value)
);

const buildAccountHref = (section: AccountSectionKey) => `/profile?section=${section}`;

const Header: React.FC<HeaderProps> = ({
  cartCount = 0,
  onCartClick,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const accountMenuRef = useRef<HTMLDivElement | null>(null);
  const { user, signOut } = useAuth();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      if (currentScrollY <= 12) {
        setIsHeaderVisible(true);
      } else if (delta > 6) {
        setIsHeaderVisible(false);
        setIsAccountMenuOpen(false);
      } else if (delta < -6) {
        setIsHeaderVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isAccountMenuOpen) {
      return undefined;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isAccountMenuOpen]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  const isAuthenticated = Boolean(user);
  const headerClass = (!isHeaderVisible && !isMenuOpen && !isAccountMenuOpen) ? 'header-hidden' : 'header-visible';

  const activeAccountSection = useMemo(() => {
    if (location.pathname !== '/profile' && location.pathname !== '/account') {
      return null;
    }

    const params = new URLSearchParams(location.search);
    const section = params.get('section');
    return isAccountSectionKey(section) ? section : DEFAULT_ACCOUNT_SECTION;
  }, [location.pathname, location.search]);

  const accountName = useMemo(() => {
    if (!user) {
      return 'Hesabım';
    }

    const firstName = readString(user.user_metadata?.first_name);
    const lastName = readString(user.user_metadata?.last_name);
    const fullName = `${firstName} ${lastName}`.trim();

    if (fullName.length > 0) {
      return fullName;
    }

    if (user.email) {
      return user.email.split('@')[0] ?? 'Hesabım';
    }

    return 'Hesabım';
  }, [user]);

  const drawerGreeting = useMemo(() => {
    if (!user) {
      return 'MERHABA';
    }

    const firstName = readString(user.user_metadata?.first_name).trim();
    const fallbackName = user.email?.split('@')[0] ?? 'HESABIM';
    return `MERHABA, ${(firstName || fallbackName).toUpperCase()}`;
  }, [user]);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsAccountMenuOpen(false);
    setIsMenuOpen((prev) => !prev);
  };

  const handleAccountNavigate = (sectionKey: AccountSectionKey) => {
    setIsAccountMenuOpen(false);
    setIsMenuOpen(false);
    navigate(buildAccountHref(sectionKey));
  };

  const handleDesktopAccountToggle = () => {
    setIsMenuOpen(false);
    setIsAccountMenuOpen((prev) => !prev);
  };

  const handleSignOut = async () => {
    try {
      setIsAccountMenuOpen(false);
      setIsMenuOpen(false);
      await signOut();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Header sign out error:', error);
    }
  };

  const handleCartShortcut = () => {
    setIsMenuOpen(false);
    onCartClick?.();
  };

  return (
    <>
      <header className={`header ${headerClass}`}>
        <div className="header-left">
          <Link to="/" className="logo">KICKEMUP</Link>
          <Navbar isOpen={false} />
        </div>

        <div className="header-right">
          <div className="header-search header-search-tablet">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Ürün, Marka veya Kategori ara" />
          </div>

          <div className="header-actions">
            <button type="button" className="cart-btn" aria-label="Sepet" onClick={onCartClick}>
              <div style={{ position: 'relative', display: 'flex' }}>
                <ShoppingBag size={24} strokeWidth={1.5} className="cart-icon" />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </div>
            </button>

            {isAuthenticated ? (
              <div className="account-menu" ref={accountMenuRef}>
                <button
                  type="button"
                  className="account-trigger"
                  aria-label="Hesap menüsünü aç"
                  aria-expanded={isAccountMenuOpen}
                  aria-haspopup="menu"
                  onClick={handleDesktopAccountToggle}
                >
                  <User size={24} strokeWidth={1.5} className="cart-icon" />
                  <div className="account-trigger-copy">
                    <span className="account-trigger-title">Hesabım</span>
                    <span className="account-trigger-subtitle">{accountName}</span>
                  </div>
                  <ChevronDown size={14} className={`account-trigger-caret ${isAccountMenuOpen ? 'open' : ''}`} />
                </button>

                {isAccountMenuOpen && (
                  <div className="account-dropdown" role="menu" aria-label="Hesap bağlantıları">
                    {ACCOUNT_SECTIONS.map((section) => (
                      <button
                        key={section.key}
                        type="button"
                        className={`account-dropdown-item ${activeAccountSection === section.key ? 'is-active' : ''}`}
                        onClick={() => handleAccountNavigate(section.key)}
                      >
                        {section.dropdownLabel}
                      </button>
                    ))}

                    <button
                      type="button"
                      className="account-dropdown-item account-dropdown-signout"
                      onClick={handleSignOut}
                    >
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="account-trigger account-trigger-link" aria-label="Giriş yap">
                <User size={24} strokeWidth={1.5} className="cart-icon" />
              </Link>
            )}

            <button type="button" className="menu-btn" onClick={toggleMenu} aria-label="Menü">
              {isMenuOpen ? <X size={24} className="menu-icon" /> : <MenuIcon size={24} className="menu-icon" />}
            </button>
          </div>
        </div>

        <div className="header-search header-search-mobile">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Ürün, Marka veya Kategori ara" />
        </div>
      </header>

      {isMenuOpen && <button type="button" className="mobile-menu-overlay" onClick={closeMenu} aria-label="Menüyü kapat" />}

      <aside className={`mobile-menu ${isMenuOpen ? 'open' : ''}`} aria-hidden={!isMenuOpen}>
        <div className="mobile-menu-header">
          <Link to="/" className="mobile-menu-logo" onClick={closeMenu}>KICKEMUP</Link>
          <button type="button" className="mobile-menu-close" onClick={closeMenu} aria-label="Menüyü kapat">
            <X size={26} strokeWidth={1.8} />
          </button>
        </div>

        <div className="mobile-menu-body">
          <div className="mobile-account-row">
            <span className="mobile-account-greeting">{drawerGreeting}</span>
            <Link
              to={isAuthenticated ? buildAccountHref('profile') : '/login'}
              className="mobile-account-link"
              onClick={closeMenu}
            >
              {isAuthenticated ? 'Hesabım' : 'Giriş Yap'}
              <ChevronRight size={16} strokeWidth={1.8} />
            </Link>
          </div>

          <nav className="mobile-nav" aria-label="Mobil kategori menüsü">
            {MOBILE_NAV_ITEMS.map((item) => (
              <Link key={item.label} to={item.href} className="mobile-nav-link" onClick={closeMenu}>
                <span>{item.label}</span>
                <ChevronRight size={18} strokeWidth={1.8} />
              </Link>
            ))}
          </nav>
        </div>

        <div className="mobile-menu-footer">
          <div className="mobile-shortcuts">
            <Link
              to={isAuthenticated ? buildAccountHref('orders') : '/login'}
              className="mobile-shortcut-link"
              onClick={closeMenu}
            >
              <Package size={18} strokeWidth={1.8} />
              <span>Siparişlerim</span>
            </Link>

            <button type="button" className="mobile-shortcut-link mobile-shortcut-button" onClick={handleCartShortcut}>
              <ShoppingBag size={18} strokeWidth={1.8} />
              <span>Sepetim</span>
            </button>
          </div>

          {isAuthenticated ? (
            <button type="button" className="mobile-menu-auth-button" onClick={handleSignOut}>
              ÇIKIŞ YAP
            </button>
          ) : (
            <Link to="/login" className="mobile-menu-auth-button mobile-menu-auth-link" onClick={closeMenu}>
              GİRİŞ YAP
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};

export default Header;
