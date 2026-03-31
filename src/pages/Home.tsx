import React from 'react';
import Hero from '../components/Hero';
import ProductShowcase from '../components/ProductShowcase';
import ProductSlider from '../components/ProductSlider';
import Categories from '../components/Categories';
import { sneakers } from '../data/products';



interface HomeProps {
  onProductClick: (product: any) => void;
  onAddToCart: (product: any) => void;
}

const Home: React.FC<HomeProps> = ({ onProductClick, onAddToCart }) => {
  return (
    <main>
      <Hero />
      <ProductSlider title="Yeni Gelen Sneaker'lar" products={sneakers} onProductClick={onProductClick} />
      <Categories />
      <ProductShowcase onProductClick={onProductClick} onAddToCart={onAddToCart} />
    </main>
  );
};

export default Home;
