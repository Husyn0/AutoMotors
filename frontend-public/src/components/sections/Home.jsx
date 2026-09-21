// src/components/sections/Home.jsx
import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCategories } from '../../context/CategoriesContext';
import battery from '../../assets/output/battery.png';
import Lub from '../../assets/output/Lubricants.png';
import wheel from '../../assets/output/wheel.png';
import spare from '../../assets/output/spare.png';

const Home = () => {
  const { t } = useLanguage();
  const { categories, loading: catsLoading } = useCategories();

  // Fallback to translation if API hasn't loaded or failed
  const dynamicDescription =
    !catsLoading && categories.length > 0
      ? categories.map((c) => c.name).join(', ')
      : t.home.description;

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="home">
      <div className="home-content">
        <h1 className="home-title">
          <span className="highlight">{t.home.title}</span>
        </h1>
        <p className="home-subtitle">{t.home.subtitle}</p>
        <p className="home-description">{dynamicDescription}</p>
        <button className="cta-button" onClick={scrollToProducts}>
          {t.home.cta}
        </button>
      </div>
      <div className="home-bg">
        <div className="floating-icons">
          <span className="icon icon-1"><img src={battery} alt="Battery" /></span>
          <span className="icon icon-2"><img src={Lub} alt="Lubricants" /></span>
          <span className="icon icon-3"><img src={wheel} alt="Wheel" /></span>
          <span className="icon icon-4"><img src={spare} alt="Spare Parts" /></span>
        </div>
      </div>
    </section>
  );
};

export default Home;