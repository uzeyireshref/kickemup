import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import './Auth.css';

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">ÜYE OL</h1>
        
        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <div className="auth-input-group">
            <input type="text" placeholder="Ad" className="auth-input" />
          </div>
          
          <div className="auth-input-group">
            <input type="text" placeholder="Soyad" className="auth-input" />
          </div>

          <div className="auth-input-group">
            <input type="email" placeholder="E-mail" className="auth-input" />
          </div>
          
          <div className="auth-input-group">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Şifre" 
              className="auth-input" 
            />
            <button 
              type="button"
              className="password-eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="auth-checkbox-group" style={{marginTop: '0.5rem'}}>
            <input type="checkbox" id="terms" />
            <label htmlFor="terms">
              <a href="#aydinlatma">Aydınlatma Metni</a>'ni ve <a href="#sozlesme">Üyelik Sözleşmesi</a>'ni okudum ve onaylıyorum.
            </label>
          </div>

          <div className="auth-checkbox-group">
            <input type="checkbox" id="consent" />
            <label htmlFor="consent">
              <a href="#riza">Açık Rıza Metni</a>'ni ve <a href="#sozlesme">Açık Rıza Metni</a>'ni ve <a href="#iletisim">Ticari Elektronik İletişim İzni Açık Rıza Metni</a>'ni onaylıyorum.
            </label>
          </div>
          
          <button type="submit" className="auth-button" style={{marginTop: '1rem'}}>
            ÜYE OL
          </button>
        </form>

        <p className="auth-disclaimer" style={{textAlign: 'left', marginTop: '1.25rem'}}>
          Bu site reCAPTCHA tarafından korunmaktadır ve Google <a href="#privacy">Gizlilik Politikası</a> ve <a href="#terms">Hizmet Şartları</a> geçerlidir.
        </p>

        <div className="auth-links" style={{flexDirection: 'column', gap: '0.25rem', marginTop: '1.5rem', alignItems: 'center'}}>
          <span style={{fontSize: '0.8rem', color: '#999'}}>Zaten hesabınız var mı?</span>
          <Link to="/login" className="auth-link">Üye Girişi</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
