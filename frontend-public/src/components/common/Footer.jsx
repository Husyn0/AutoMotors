// src/components/common/Footer.jsx
import React, { useContext } from 'react';
import { LanguageContext } from '../../App';

const Footer = () => {
  const { t } = useContext(LanguageContext);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>AUTOMOTORS</h3>
            <p>{t.footer.company}</p>
          </div>
          <div className="footer-social">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="Instagram">📸</a>
            <a href="#" aria-label="LinkedIn">💼</a>
          </div>
          <div className="footer-copy">
            <p>&copy; {currentYear} AUTOMOTORS. {t.footer.rights}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;