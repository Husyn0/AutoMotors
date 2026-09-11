// src/components/sections/Services.jsx
import React, { useContext } from 'react';
import { LanguageContext } from '../../App';
import { servicesData } from '../../api/data';
import { getServices } from '../../api/endpoints';
import { useApi } from '../../hooks/useApi';

const Services = () => {
  const { language, t } = useContext(LanguageContext);
  const fallback = servicesData[language];

  const { data, loading } = useApi(getServices, [], {
    services: fallback.services,
    advantages: fallback.advantages,
  });

  // Handle Laravel shape: { data: { services: [...], advantages: [...] } } OR plain
  const services = data?.services || data?.data?.services || fallback.services;
  const advantages = data?.advantages || data?.data?.advantages || fallback.advantages;

  if (loading) return <div className="loader">Loading services…</div>;

  return (
    <section id="services" className="services">
      <div className="container">
        <h2 className="section-title">{t.services.title}</h2>
        <p className="section-subtitle">{t.services.subtitle}</p>
        
        <div className="services-wrapper">
          {/* Services List - Left Side */}
          <div className="services-list">
            <h3 className="list-title">📋 Nos services</h3>
            {services.map((service, index) => (
              <div key={service.id} className="service-item">
                <div className="service-number">{String(index + 1).padStart(2, '0')}</div>
                <div className="service-info">
                  <h4>{service.title}</h4>
                  <p>{service.description}</p>
                </div>
                <div className="service-check">✓</div>
              </div>
            ))}
          </div>

          {/* Advantages Section - Right Side */}
          <div className="advantages-section">
            <h3 className="advantages-title">{t.services.advantagesTitle}</h3>
            <div className="advantages-list">
              {advantages.map((advantage, index) => (
                <div key={index} className="advantage-item">
                  <span className="advantage-icon">✦</span>
                  <span className="advantage-text">{advantage}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;