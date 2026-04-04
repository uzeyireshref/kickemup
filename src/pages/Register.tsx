import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import './Auth.css';

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedConsent, setAcceptedConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { signUp, authError, clearAuthError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = useMemo(() => {
    const state = location.state as { from?: string } | null;

    if (!state?.from || state.from === '/login' || state.from === '/register') {
      return '/';
    }

    return state.from;
  }, [location.state]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearAuthError();
    setLocalError(null);
    setSuccessMessage(null);

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setLocalError('Tüm alanları doldurman gerekiyor.');
      return;
    }

    if (!acceptedTerms || !acceptedConsent) {
      setLocalError('Devam etmek için gerekli onayları vermelisin.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Şifre en az 6 karakter olmalı.');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await signUp({
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      if (result.status === 'signed_in') {
        navigate(redirectPath, { replace: true });
        return;
      }

      setSuccessMessage('Kayıt oluştu. E-posta doğrulaması gerekiyorsa lütfen mail kutunuzu kontrol edin.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Kayıt oluşturulamadı.';
      setLocalError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">ÜYE OL</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <input
              type="text"
              placeholder="Ad"
              className="auth-input"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              autoComplete="given-name"
            />
          </div>

          <div className="auth-input-group">
            <input
              type="text"
              placeholder="Soyad"
              className="auth-input"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              autoComplete="family-name"
            />
          </div>

          <div className="auth-input-group">
            <input
              type="email"
              placeholder="E-posta"
              className="auth-input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="auth-input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Şifre"
              className="auth-input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-eye"
              aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="auth-checkbox-group" style={{ marginTop: '0.5rem' }}>
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(event) => setAcceptedTerms(event.target.checked)}
            />
            <label htmlFor="terms">
              <a href="#aydinlatma">Aydınlatma Metni</a>'ni ve <a href="#sozlesme">Üyelik Sözleşmesi</a>'ni okudum ve
              onaylıyorum.
            </label>
          </div>

          <div className="auth-checkbox-group">
            <input
              type="checkbox"
              id="consent"
              checked={acceptedConsent}
              onChange={(event) => setAcceptedConsent(event.target.checked)}
            />
            <label htmlFor="consent">
              <a href="#riza">Açık Rıza Metni</a>'ni ve <a href="#iletisim">Ticari Elektronik İletişim İzni Açık Rıza Metni</a>'ni
              onaylıyorum.
            </label>
          </div>

          {displayError && <p className="auth-feedback auth-feedback-error">{displayError}</p>}
          {successMessage && <p className="auth-feedback auth-feedback-success">{successMessage}</p>}

          <button type="submit" className="auth-button" style={{ marginTop: '1rem' }} disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="auth-button-loading">
                <Loader2 size={16} className="spinning" />
                ÜYE OLUNUYOR
              </span>
            ) : (
              'ÜYE OL'
            )}
          </button>
        </form>

        <p className="auth-disclaimer" style={{ textAlign: 'left', marginTop: '1.25rem' }}>
          Bu site reCAPTCHA tarafından korunmaktadır ve Google <a href="#privacy">Gizlilik Politikası</a> ve{' '}
          <a href="#terms">Hizmet Şartları</a> geçerlidir.
        </p>

        <div
          className="auth-links"
          style={{ flexDirection: 'column', gap: '0.25rem', marginTop: '1.5rem', alignItems: 'flex-start' }}
        >
          <span style={{ fontSize: '0.8rem', color: '#999' }}>Zaten hesabınız var mı?</span>
          <Link to="/login" className="auth-link">Üye Girişi</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
