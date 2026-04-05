import { useEffect, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { sanitizeAuthRedirectPath } from '../lib/auth';
import './Auth.css';

const AuthCallback = () => {
  const { user, isAuthLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const callbackError = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const hashParams = new URLSearchParams(location.hash.startsWith('#') ? location.hash.slice(1) : location.hash);

    return (
      searchParams.get('error_description')
      || hashParams.get('error_description')
      || searchParams.get('error')
      || hashParams.get('error')
    );
  }, [location.hash, location.search]);

  const redirectPath = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return sanitizeAuthRedirectPath(searchParams.get('next'));
  }, [location.search]);

  useEffect(() => {
    if (!isAuthLoading && user) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthLoading, navigate, redirectPath, user]);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">GOOGLE GIRISI</h1>

        <div className="auth-oauth-status">
          {callbackError ? (
            <>
              <p className="auth-feedback auth-feedback-error">{callbackError}</p>
              <p>Google ile giris tamamlanamadi. Ayarlari kontrol edip tekrar deneyebilirsiniz.</p>
              <Link to="/login" className="auth-link">Giris sayfasina don</Link>
            </>
          ) : isAuthLoading ? (
            <>
              <span className="auth-button-loading">
                <Loader2 size={16} className="spinning" />
                OTURUM HAZIRLANIYOR
              </span>
              <p>Google hesabiniz dogrulaniyor. Birkac saniye icinde yonlendirileceksiniz.</p>
            </>
          ) : user ? (
            <p>Hesabiniz hazirlaniyor, yonlendiriliyorsunuz...</p>
          ) : (
            <>
              <p className="auth-feedback auth-feedback-error">Google ile oturum baslatilamadi.</p>
              <p>
                Supabase Google saglayicisi etkin degilse veya redirect adresi tanimli degilse bu ekrani
                gorebilirsiniz.
              </p>
              <Link to="/login" className="auth-link">Giris sayfasina don</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
