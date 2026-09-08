// src/components/sections/TruckTypes.jsx
import React, { useContext } from 'react';
import { LanguageContext } from '../../App';
import { truckTypesData } from '../../api/data';

const TruckTypes = () => {
  const { language, t } = useContext(LanguageContext);
  const truckTypes = truckTypesData[language];

  return (
    <section id="truckTypes" className="truck-types">
      <div className="container">
        <h2 className="section-title">{t.truckTypes.title}</h2>
        <p className="section-subtitle">{t.truckTypes.subtitle}</p>
        <div className="truck-types-grid">
          {truckTypes.map((type) => (
            <div key={type.id} className="truck-type-card">
              <div className="truck-icon">{type.icon}</div>
              <h3>{type.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TruckTypes;