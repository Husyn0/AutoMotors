// src/components/sections/Home.jsx
import React, { useContext } from 'react';
import { LanguageContext } from '../../App';
import battery from '../../assets/output/battery.png';
import Lub from '../../assets/output/Lubricants.png';
import wheel from '../../assets/output/wheel.png';
import spare from '../../assets/output/spare.png';

const Home = () => {
  const { t } = useContext(LanguageContext);

  const scrollToProducts = () => {
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="home">
      <div className="home-content">
        <h1 className="home-title">
          <span className="highlight">{t.home.title}</span>
        </h1>
        <p className="home-subtitle">{t.home.subtitle}</p>
        <p className="home-description">{t.home.description}</p>
        <button className="cta-button" onClick={scrollToProducts}>
          {t.home.cta}
        </button>
      </div>
      <div className="home-bg">
        <div className="floating-icons">
          <span className="icon"><img src={battery} style={{width:250}}/></span>
          <span className="icon"><img src={Lub} style={{width:450}}/></span>
          <span className="icon"><img src={wheel} style={{width:250}}/></span>
          <span className="icon"><img src={spare} style={{width:450}}/></span>
        </div>
      </div>
    </section>
  );
};

export default Home;