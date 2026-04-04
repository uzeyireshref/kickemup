import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import './ProfilePage.css';

type ProfileFormState = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
};

type FeedbackState = {
  type: 'success' | 'error' | null;
  message: string;
};

type AccountSectionKey = 'orders' | 'addresses' | 'favorites' | 'profile' | 'raffles';

const EMPTY_FORM: ProfileFormState = {
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
};

const DEFAULT_ACCOUNT_SECTION: AccountSectionKey = 'profile';

const ACCOUNT_SECTIONS: Array<{
  key: AccountSectionKey;
  navLabel: string;
}> = [
  { key: 'orders', navLabel: 'Siparişlerim' },
  { key: 'addresses', navLabel: 'Adreslerim' },
  { key: 'favorites', navLabel: 'Beğendiğim Ürünler' },
  { key: 'profile', navLabel: 'Profilim' },
  { key: 'raffles', navLabel: 'Raffle Katılımlarım' },
];

const readString = (value: unknown) => (typeof value === 'string' ? value : '');

const buildFullName = (firstName: string, lastName: string) => {
  const value = `${firstName} ${lastName}`.trim();
  return value.length > 0 ? value : null;
};

const isAccountSectionKey = (value: string | null): value is AccountSectionKey => (
  ACCOUNT_SECTIONS.some((section) => section.key === value)
);

const buildAccountHref = (section: AccountSectionKey) => `/profile?section=${section}`;

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState<ProfileFormState>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>({ type: null, message: '' });

  const sectionParam = searchParams.get('section');
  const activeSection = isAccountSectionKey(sectionParam) ? sectionParam : DEFAULT_ACCOUNT_SECTION;
  const activeSectionConfig = useMemo(
    () => ACCOUNT_SECTIONS.find((section) => section.key === activeSection) ?? ACCOUNT_SECTIONS[3],
    [activeSection],
  );

  useEffect(() => {
    let isActive = true;

    const loadProfile = async () => {
      if (!user) {
        return;
      }

      setIsLoading(true);
      setFeedback({ type: null, message: '' });

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (!isActive) {
        return;
      }

      if (error) {
        console.error('Profile fetch error:', error);
        setFeedback({
          type: 'error',
          message: 'Profil bilgileri alınamadı. Lütfen biraz sonra tekrar deneyin.',
        });
        setIsLoading(false);
        return;
      }

      const metadata = (user.user_metadata ?? {}) as Record<string, unknown>;

      setForm({
        firstName: readString(data?.first_name) || readString(metadata.first_name),
        lastName: readString(data?.last_name) || readString(metadata.last_name),
        phone: readString(data?.phone),
        address: readString(data?.address),
      });
      setIsLoading(false);
    };

    loadProfile();

    return () => {
      isActive = false;
    };
  }, [user]);

  const handleInputChange = (field: keyof ProfileFormState) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      return;
    }

    setIsSaving(true);
    setFeedback({ type: null, message: '' });

    const nextFirstName = form.firstName.trim();
    const nextLastName = form.lastName.trim();
    const nextPhone = form.phone.trim();
    const nextAddress = form.address.trim();

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email ?? null,
        first_name: nextFirstName || null,
        last_name: nextLastName || null,
        full_name: buildFullName(nextFirstName, nextLastName),
        phone: nextPhone || null,
        address: nextAddress || null,
      }, { onConflict: 'id' });

    if (error) {
      console.error('Profile update error:', error);
      setFeedback({
        type: 'error',
        message: 'Profil güncellenemedi. Lütfen tekrar deneyin.',
      });
      setIsSaving(false);
      return;
    }

    setFeedback({
      type: 'success',
      message: 'Bilgileriniz güncellendi.',
    });
    setIsSaving(false);
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setFeedback({ type: null, message: '' });

    try {
      await signOut();
      navigate('/', { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Oturum kapatılamadı. Lütfen tekrar deneyin.';
      setFeedback({ type: 'error', message });
    } finally {
      setIsSigningOut(false);
    }
  };

  const renderEmptyState = () => (
    <div className="account-empty-state">
      <div className="account-empty-box">
        <p>
          Henüz bir kaydınız yok. <Link to="/">Ürünlere göz at</Link>
        </p>
      </div>
    </div>
  );

  const renderProfileSection = () => (
    <div className="account-panel">
      <div className="account-panel-header">
        <p className="account-panel-eyebrow">{activeSectionConfig.navLabel}</p>
        <h1>Profil Bilgileri</h1>
        <p>
          Ad, soyad, telefon ve adres bilgilerinizi düzenleyebilir; hesabınıza bağlı e-posta adresini
          görüntüleyebilirsiniz.
        </p>
      </div>

      <form className="account-form" onSubmit={handleSubmit}>
        {isLoading ? (
          <div className="account-loading">
            <Loader2 size={20} className="spinning" />
            <span>Profil bilgileriniz yükleniyor...</span>
          </div>
        ) : (
          <>
            <div className="account-grid">
              <label className="account-field">
                <span>Ad</span>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={handleInputChange('firstName')}
                  autoComplete="given-name"
                />
              </label>

              <label className="account-field">
                <span>Soyad</span>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={handleInputChange('lastName')}
                  autoComplete="family-name"
                />
              </label>

              <label className="account-field">
                <span>Telefon</span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={handleInputChange('phone')}
                  autoComplete="tel"
                  inputMode="tel"
                />
              </label>

              <label className="account-field">
                <span>E-posta</span>
                <input type="email" value={user?.email ?? ''} readOnly className="account-readonly" />
              </label>

              <label className="account-field account-field-full">
                <span>Adres</span>
                <textarea
                  value={form.address}
                  onChange={handleInputChange('address')}
                  autoComplete="street-address"
                  rows={5}
                />
              </label>
            </div>

            {feedback.type && (
              <p className={`account-feedback account-feedback-${feedback.type}`}>
                {feedback.message}
              </p>
            )}

            <div className="account-actions">
              <button type="submit" className="account-primary-button" disabled={isSaving}>
                {isSaving ? 'Güncelleniyor...' : 'Güncelle'}
              </button>

              <button
                type="button"
                className="account-secondary-button"
                onClick={handleSignOut}
                disabled={isSigningOut}
              >
                {isSigningOut ? 'Oturum Kapatılıyor...' : 'Oturumu Kapat'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );

  return (
    <div className="account-page">
      <div className="account-subnav-wrap">
        <nav className="account-subnav" aria-label="Hesap yönetim menüsü">
          {ACCOUNT_SECTIONS.map((section) => (
            <Link
              key={section.key}
              to={buildAccountHref(section.key)}
              className={`account-subnav-link ${section.key === activeSection ? 'is-active' : ''}`}
            >
              {section.navLabel}
            </Link>
          ))}
        </nav>
      </div>

      <section className="account-content">
        {activeSection === 'profile' ? renderProfileSection() : renderEmptyState()}
      </section>
    </div>
  );
};

export default ProfilePage;
