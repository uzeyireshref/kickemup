import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import './Auth.css';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">GİRİŞ YAP</h1>

        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <div className="auth-input-group">
            <input type="email" placeholder="E-mail" className="auth-input" />
          </div>

          <div className="auth-input-group">
            <input type={showPassword ? 'text' : 'password'} placeholder="Şifre" className="auth-input" />
            <button type="button" className="password-eye" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button type="submit" className="auth-button">GİRİŞ YAP</button>
        </form>

        <p className="auth-disclaimer">
          Bu site reCAPTCHA tarafından korunmaktadır ve Google <a href="#privacy">Gizlilik Politikası</a> ve <a href="#terms">Hizmet Şartları</a> geçerlidir.
        </p>

        <div className="auth-links">
          <span className="auth-link">Parolamı Unuttum</span>
          <span>Hesabınız yok mu? <Link to="/register" className="auth-link">Kayıt ol</Link></span>
        </div>

        <div className="auth-text-center">
          E-ticaret altyapımızı size daha iyi bir deneyim sunmak için yeniledik!
          Hesabınıza giriş yapabilmeniz için, <strong>PAROLAMI UNUTTUM</strong> butonunu kullanarak şifrenizi yenilemelisiniz
        </div>

        <div className="auth-divider">ya da</div>

        <button className="google-btn">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google ile giriş yap
        </button>
      </div>
    </div>
  );
};

export default Login;
