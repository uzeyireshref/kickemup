import { motion } from 'framer-motion';
import './Categories.css';

const categories = [
  {
    id: 1,
    title: 'SNEAKER',
    image: '/categories/sneaker.jpg', 
    link: '#sneaker'
  },
  {
    id: 2,
    title: 'GİYİM',
    image: '/categories/giyim.jpg', 
    link: '#giyim'
  },
  {
    id: 3,
    title: 'AKSESUAR',
    image: '/categories/aksesuar.jpg',
    link: '#aksesuar'
  }
];

const Categories = () => {
  return (
    <section className="categories-section">
      <div className="categories-grid">
        {categories.map((category, index) => (
          <motion.a 
            href={category.link}
            key={category.id} 
            className="category-card"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
          >
            <div className="category-image-container">
              <div className="category-overlay"></div>
              <img src={category.image} alt={category.title} className="category-image" />
              <h3 className="category-title">{category.title}</h3>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default Categories;
