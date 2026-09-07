// src/App.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import './App.css';
import i18n from './i18n';

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const { t } = useTranslation();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState(i18n.language);

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const response = await axios.get(`${API_URL}/company`);
      setCompany(response.data);
    } catch (error) {
      console.error('Error fetching company:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setCurrentLang(lang);
    localStorage.setItem('lang', lang);
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (!company) return <div>No data</div>;

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <h1>{company.name}</h1>
            </div>
            <nav>
              <a href="#about">{t('about')}</a>
              <a href="#services">{t('services')}</a>
              <a href="#products">{t('products')}</a>
              <a href="#contact">{t('contact')}</a>
            </nav>
            <div className="lang-switcher">
              <button 
                className={currentLang === 'fr' ? 'active' : ''} 
                onClick={() => changeLanguage('fr')}
              >
                FR
              </button>
              <button 
                className={currentLang === 'en' ? 'active' : ''} 
                onClick={() => changeLanguage('en')}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="hero">
          <div className="container">
            <h1>{company.name}</h1>
            <p>{company.about}</p>
          </div>
        </section>

        {/* About */}
        <section id="about" className="section">
          <div className="container">
            <h2>{t('about')}</h2>
            <div className="about-grid">
              <div className="about-card">
                <h3>{t('mission')}</h3>
                <p>{company.mission}</p>
              </div>
              <div className="about-card">
                <h3>{t('vision')}</h3>
                <p>{company.vision}</p>
              </div>
              <div className="about-card">
                <h3>{t('location')}</h3>
                <p>{company.location}</p>
              </div>
            </div>
            <p className="delivery-info">{company.delivery_info}</p>
          </div>
        </section>

        {/* Advantages */}
        <section className="section advantages">
          <div className="container">
            <h2>{t('advantages')}</h2>
            <div className="advantages-grid">
              {company.advantages.map((adv, index) => (
                <div key={index} className="advantage-item">
                  <i className="fas fa-check-circle"></i>
                  <span>{adv.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="section">
          <div className="container">
            <h2>{t('services')}</h2>
            <div className="services-grid">
              {company.services.map(service => (
                <div key={service.id} className="service-card">
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vehicle Types */}
        <section className="section vehicle-types">
          <div className="container">
            <h2>{t('vehicle_types')}</h2>
            <ul>
              {company.vehicle_types.map((vt, index) => (
                <li key={index}>{vt.name}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Products */}
        <section id="products" className="section">
          <div className="container">
            <h2>{t('products')}</h2>
            <div className="products-grid">
              {company.products.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img 
                      src={`/images/products/${product.image}.jpg`} 
                      alt={product.name}
                      onError={(e) => e.target.src = '/images/placeholder.jpg'}
                    />
                  </div>
                  <h3>{product.name}</h3>
                  <p className="category">{product.category}</p>
                  <p className="description">{product.description}</p>
                  <p className="price">{product.price} FCFA</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section faq">
          <div className="container">
            <h2>{t('faq')}</h2>
            <div className="faq-list">
              {company.faqs.map((faq, index) => (
                <div key={index} className="faq-item">
                  <h4>{faq.question}</h4>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="section contact">
          <div className="container">
            <h2>{t('contact')}</h2>
            <div className="contact-info">
              <div>
                <i className="fas fa-phone"></i>
                {company.phones.map((phone, i) => (
                  <span key={i}>{phone}{i < company.phones.length - 1 ? ' | ' : ''}</span>
                ))}
              </div>
              <div>
                <i className="fas fa-envelope"></i>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          <p>&copy; 2026 {company.name}. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;