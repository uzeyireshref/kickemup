import { Link } from 'react-router-dom';
import './BrandShowcase.css';

const brandTiles = [
  {
    id: 'adidas',
    title: 'ADIDAS',
    image: '/brands/adidas.jpeg',
    brandQuery: 'adidas',
  },
  {
    id: 'new-balance',
    title: 'NEW BALANCE',
    image: '/brands/new-balance.jpeg',
    brandQuery: 'new-balance',
  },
  {
    id: 'asics',
    title: 'ASICS',
    image: '/brands/asics.jpeg',
    brandQuery: 'asics',
  },
  {
    id: 'champion',
    title: 'CHAMPION',
    image: '/brands/champion.jpeg',
    brandQuery: 'champion',
  },
  {
    id: 'puma',
    title: 'PUMA',
    image: '/brands/puma.jpg',
    brandQuery: 'puma',
  },
  {
    id: 'vans',
    title: 'VANS',
    image: '/brands/vans.jpg',
    brandQuery: 'vans',
  },
];

const BrandShowcase = () => {
  return (
    <section className="brand-showcase">
      <div className="brand-showcase-grid">
        {brandTiles.map((tile) => (
          <Link
            key={tile.id}
            to={`/products?brand=${encodeURIComponent(tile.brandQuery)}`}
            className="brand-showcase-link"
          >
            <article className="brand-showcase-card">
              <img src={tile.image} alt={tile.title} className="brand-showcase-image" loading="lazy" />
              <div className="brand-showcase-overlay" />
              <div className="brand-showcase-content">
                <h3>{tile.title}</h3>
                <span>ALISVERISE BASLA</span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default BrandShowcase;
