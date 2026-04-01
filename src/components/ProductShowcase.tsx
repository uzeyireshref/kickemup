import { motion } from 'framer-motion';
import './ProductShowcase.css';
import { allProducts } from '../data/products';
import ProductCard from './ProductCard';

const products = allProducts;

interface Props {
  onAddToCart?: (product: any) => void;
}

const ProductShowcase = ({ onAddToCart }: Props) => {
  return (
    <section className="product-showcase" id="new">
      <motion.div
        className="showcase-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">Seçili Parçalar</h2>
        <a href="#all" className="view-all">Tümünü Gör →</a>
      </motion.div>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product as any} onAddToCart={onAddToCart} />
        ))}
      </div>
    </section>
  );
};

export default ProductShowcase;
