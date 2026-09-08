// src/components/sections/Services.jsx
import React, { useContext } from 'react';
import { LanguageContext } from '../../App';
import { servicesData } from '../../api/data';

const Services = () => {
  const { language, t } = useContext(LanguageContext);
  const services = servicesData[language];

  return (
    <section id="services" className="services">
      <div className="container">
        <h2 className="section-title">{t.services.title}</h2>
        <p className="section-subtitle">{t.services.subtitle}</p>
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;