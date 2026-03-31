import { Store, ShieldCheck, Truck } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      {/* TOP SECTION */}
      <div className="footer-top">
        <div className="footer-top-left">
          <h2 className="footer-logo">KICKEMUP.</h2>
          <div className="social-icons">
            {/* Facebook */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            {/* Twitter / X */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
            {/* Youtube */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
            {/* Instagram */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            {/* Tiktok placeholder */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
          </div>
        </div>
        <div className="footer-top-right">
          <div className="app-badge store-badge-apple">
             <div style={{textAlign: 'left'}}>
               <span style={{fontSize: '0.6rem'}}>App Store'dan</span><br/>
               <span style={{fontSize: '0.85rem', fontWeight: 'bold'}}>İndirin</span>
             </div>
          </div>
          <div className="app-badge store-badge-google">
             <div style={{textAlign: 'left'}}>
               <span style={{fontSize: '0.6rem'}}>Google Play'den</span><br/>
               <span style={{fontSize: '0.85rem', fontWeight: 'bold'}}>Alın</span>
             </div>
          </div>
        </div>
      </div>

      <div className="footer-divider"></div>

      {/* MIDDLE SECTION */}
      <div className="footer-middle">
        
        {/* Column 1 */}
        <div className="footer-col col-sana-ozel">
          <h4 className="footer-col-title">SANA ÖZEL</h4>
          
          <div className="feature-item">
            <div className="feature-icon"><Store size={26} strokeWidth={1.5} /></div>
            <div className="feature-text">
              <h5>MAĞAZADAN TESLİM</h5>
              <p>Siparişini herhangi bir mağazamızdan, kargo ücretsiz teslim alabilirsin.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon"><ShieldCheck size={26} strokeWidth={1.5} /></div>
            <div className="feature-text">
              <h5>SADAKAT PROGRAMI</h5>
              <p>Friends Programı ile yapacağın her alışverişten tokenlar ve ayrıcalıklar kazanabilirsin.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon"><Truck size={26} strokeWidth={1.5} /></div>
            <div className="feature-text">
              <h5>ÜCRETSİZ KARGO</h5>
              <p>Seçili kargo yöntemi ile 5.000 TL üzeri siparişlerinde kargon bizden.</p>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="footer-col col-kategoriler">
          <h4 className="footer-col-title">KATEGORİLER</h4>
          <div className="kategoriler-grid">
            <ul className="footer-list">
              <li><a href="#link">On Sneaker</a></li>
              <li><a href="#link">adidas Sneaker</a></li>
              <li><a href="#link">New Balance 9060</a></li>
              <li><a href="#link">Nike Sneaker</a></li>
              <li><a href="#link">Nike Tech Fleece</a></li>
              <li><a href="#link">Asics NYC</a></li>
              <li><a href="#link">New Balance 530</a></li>
              <li><a href="#link">Champion Classics</a></li>
            </ul>
            <ul className="footer-list">
              <li><a href="#link">Tüm Koleksiyonlar</a></li>
              <li><a href="#link">Çok Satanlar</a></li>
              <li><a href="#link">Kampanyalar</a></li>
              <li><a href="#link">İndirim</a></li>
              <li><a href="#link">Basketbol</a></li>
              <li><a href="#link">NBA</a></li>
              <li><a href="#link">Sneaker</a></li>
              <li><a href="#link">Çevre Dostu</a></li>
            </ul>
          </div>
        </div>

        {/* Column 3 */}
        <div className="footer-col">
          <h4 className="footer-col-title">YARDIM</h4>
          <ul className="footer-list">
            <li><a href="#link">İletişim</a></li>
            <li><a href="#link">Favorilerim</a></li>
            <li><a href="#link">Hesabım</a></li>
            <li><a href="#link">Sipariş Takibi</a></li>
            <li><a href="#link">İade ve Değişim</a></li>
            <li><a href="#link">Sıkça Sorulan Sorular</a></li>
            <li><a href="#link">İşlem Rehberi</a></li>
          </ul>
        </div>

        {/* Column 4 */}
        <div className="footer-col">
          <h4 className="footer-col-title brand-title"><span className="blue-bg">KICKEMUP</span></h4>
          <ul className="footer-list">
            <li><a href="#link">Hakkımızda</a></li>
            <li><a href="#link">Bilgi Toplumu Hizmetleri</a></li>
            <li><a href="#link">Mağazalar</a></li>
            <li><a href="#link">Kariyer</a></li>
            <li><a href="#link">Kickemup Blog</a></li>
          </ul>
        </div>

      </div>

      <div className="footer-divider-bottom"></div>

      {/* BOTTOM SECTION */}
      <div className="footer-bottom">
        <div className="footer-bottom-left">
          <div className="etbis-qr">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M7 7h10"/><path d="M7 11h10"/><path d="M7 15h10"/></svg>
          </div>
          <div className="group-logo">KICKEM<span>GROUP</span></div>
        </div>
        
        <div className="footer-bottom-center">
          <span className="copyright">© 2026 Kickemup Tüm Hakkı Saklıdır.</span>
          <div className="footer-bottom-links">
            <a href="#kvkk">KVKK</a>
            <a href="#veri">Veri Güvenliği Politikası</a>
            <a href="#cerez">Çerez Politikası</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
