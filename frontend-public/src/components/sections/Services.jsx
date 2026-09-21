// src/components/sections/Services.jsx
import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { servicesData } from '../../api/data';
import { getServices } from '../../api/endpoints';
import { useApi } from '../../hooks/useApi';
import { splitServicesPayload } from '../../api/normalize';

const Services = () => {
  const { language, t } = useLanguage();
  const fallback = servicesData[language];

  const { data, loading, error } = useApi(
    getServices,
    [],
    { services: fallback.services, advantages: fallback.advantages }
  );

  // Normalize whatever shape we got back
  const { services, advantages } = splitServicesPayload(data);

  // Final safety: if the API returned nothing for one bucket,
  // fall back to that bucket's static data only.
  const finalServices = services.length ? services : fallback.services;
  const finalAdvantages = advantages.length ? advantages : fallback.advantages;

  if (loading) return <div className="loader">Loading services…</div>;
  if (error && !finalServices.length) {
    return <div className="loader">Unable to load services.</div>;
  }

  return (
    <section id="services" className="services">
      <div className="container">
        <h2 className="section-title">{t.services.title}</h2>
        <p className="section-subtitle">{t.services.subtitle}</p>

        <div className="services-wrapper">
          {/* -------- Services list (type = srv) -------- */}
          <div className="services-list">
            <h3 className="list-title">📋 {t.services.listTitle}</h3>
            {finalServices.map((service, index) => (
              <div key={service.id} className="service-item">
                <div className="service-number">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="service-info">
                  <h4>{service.title}</h4>
                  <p>{service.description}</p>
                </div>
                <div className="service-check">✓</div>
              </div>
            ))}
          </div>

          {/* -------- Advantages list (type = adv) -------- */}
          <div className="advantages-section">
            <h3 className="advantages-title">{t.services.advantagesTitle}</h3>
            <div className="advantages-list">
              {finalAdvantages.map((adv, index) => (
                <div key={adv.id ?? index} className="advantage-item">
                  <span className="advantage-icon">
                    {adv.icon || '✦'}
                  </span>
                  <span className="advantage-text">
                    {/* DB stores full text in `title` for adv rows;
                        `description` exists but is usually empty for advantages.
                        Pick whichever is present. */}
                    {adv.title || adv.description}
                  </span>
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