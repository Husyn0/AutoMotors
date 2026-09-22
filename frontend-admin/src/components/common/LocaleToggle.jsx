// src/components/common/LocaleToggle.jsx
import React from 'react';
import { getLocale, setLocale } from '../../api/api';

const LocaleToggle = ({ locale, onChange }) => {
  const next = locale === 'fr' ? 'en' : 'fr';

  return (
    <button
      type="button"
      className="locale-toggle"
      onClick={() => {
        setLocale(next);
        onChange?.(next);
      }}
      aria-label={`Switch to ${next === 'fr' ? 'French' : 'English'}`}
      title={`Switch to ${next === 'fr' ? 'Français' : 'English'}`}
    >
      <span className={`locale-toggle__flag ${locale === 'fr' ? 'active' : ''}`}>
        🇫🇷
      </span>
      <span className="locale-toggle__arrow">⇄</span>
      <span className={`locale-toggle__flag ${locale === 'en' ? 'active' : ''}`}>
        🇬🇧
      </span>
    </button>
  );
};

export default LocaleToggle;