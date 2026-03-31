import Hero from '../components/Hero';
import ProductSlider from '../components/ProductSlider';
import Categories from '../components/Categories';
import { sneakers, allProducts } from '../data/products';



interface HomeProps {
  onProductClick: (product: any) => void;
  onAddToCart: (product: any) => void;
}

const Home = ({ onProductClick, onAddToCart }: HomeProps) => {
  const latestProducts = [...allProducts].reverse();

  return (
    <main>
      <Hero />
      <ProductSlider 
        title="Yeni Gelen Sneaker'lar" 
        products={sneakers} 
        onProductClick={onProductClick} 
        onAddToCart={onAddToCart} 
      />
      <Categories />
      <ProductSlider 
        title="En Son Eklenenler" 
        products={latestProducts} 
        onProductClick={onProductClick} 
        onAddToCart={onAddToCart} 
      />
    </main>
  );
};

export default Home;
