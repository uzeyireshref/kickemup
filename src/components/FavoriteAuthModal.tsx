import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import './FavoriteAuthModal.css';

interface FavoriteAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FavoriteAuthModal = ({ isOpen, onClose }: FavoriteAuthModalProps) => {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="favorite-auth-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="favorite-auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="favorite-auth-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="favorite-auth-close" onClick={onClose} aria-label="Kapat">
          <X size={18} />
        </button>
        <p className="favorite-auth-eyebrow">FAVORİLER</p>
        <h3 id="favorite-auth-title">Ürünleri favorilere eklemek için giriş yapın.</h3>
        <p className="favorite-auth-copy">
          Beğendiğiniz parçaları hesabınıza kaydedin ve daha sonra kolayca tekrar bulun.
        </p>
        <div className="favorite-auth-actions">
          <Link to="/login" className="favorite-auth-primary" onClick={onClose}>
            Giriş Yap
          </Link>
          <button type="button" className="favorite-auth-secondary" onClick={onClose}>
            Vazgeç
          </button>
        </div>
      </div>
    </div>
  );
};

export default FavoriteAuthModal;
