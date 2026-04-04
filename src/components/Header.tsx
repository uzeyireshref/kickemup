import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu as MenuIcon, Search, ShoppingBag, User, X } from 'lucide-react';
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const accountMenuRef = useRef<HTMLDivElement | null>(null);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
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

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const isHome = location.pathname === '/';
  const headerClass = (isHome && !isScrolled) ? 'transparent' : 'scrolled';
  const isAuthenticated = Boolean(user);

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

  const handleAccountNavigate = (sectionKey: AccountSectionKey) => {
    setIsAccountMenuOpen(false);
    navigate(buildAccountHref(sectionKey));
  };

  const handleDesktopAccountToggle = () => {
    setIsMenuOpen(false);
    setIsAccountMenuOpen((prev) => !prev);
  };

  const handleSignOut = async () => {
    try {
      setIsAccountMenuOpen(false);
      await signOut();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Header sign out error:', error);
    }
  };

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
          <button type="button" className="cart-btn mobile-search-btn" aria-label="Arama">
            <Search size={24} strokeWidth={1.5} className="cart-icon" />
          </button>

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
    </header>
  );
};

export default Header;
