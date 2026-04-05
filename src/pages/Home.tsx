import { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import BrandShowcase from '../components/BrandShowcase';
import ProductSlider from '../components/ProductSlider';
import Categories from '../components/Categories';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';
import type { CartItem } from '../types/cart';
import type { ProductData } from '../types/product';

interface HomeProps {
  onAddToCart: (product: CartItem) => void;
}

const Home = ({ onAddToCart }: HomeProps) => {
  const [sneakers, setSneakers] = useState<ProductData[]>([]);
  const [latest, setLatest] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: sneakData } = await supabase
          .from('products')
          .select('*, brands(name), product_images(url), categories!inner(name)')
          .eq('categories.name', 'Sneaker')
          .limit(10);

        const { data: latestData } = await supabase
          .from('products')
          .select('*, brands(name), product_images(url)')
          .order('created_at', { ascending: false })
          .limit(10);

        setSneakers(sneakData || []);
        setLatest(latestData || []);
      } catch (err) {
        console.error('Home data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <Loader2 className="spinning" size={40} />
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <main>
      <Hero />
      <BrandShowcase />
      <ProductSlider title="Yeni Gelen Sneaker'lar" products={sneakers} onAddToCart={onAddToCart} />
      <Categories />
      <ProductSlider title="En Son Eklenenler" products={latest} onAddToCart={onAddToCart} />
    </main>
  );
};

export default Home;
