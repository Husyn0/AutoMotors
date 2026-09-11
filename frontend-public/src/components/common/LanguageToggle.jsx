// src/components/common/LanguageToggle.jsx
import React, { useContext } from 'react';
import { LanguageContext } from '../../App';

const LanguageToggle = () => {
  const { language, setLanguage } = useContext(LanguageContext);

  const toggleLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  return (
    <div className="language-toggle">
      <button
        className={language === 'fr' ? 'active' : ''}
        onClick={() => toggleLanguage('fr')}
      >
        FR
      </button>
      <button
        className={language === 'en' ? 'active' : ''}
        onClick={() => toggleLanguage('en')}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageToggle;