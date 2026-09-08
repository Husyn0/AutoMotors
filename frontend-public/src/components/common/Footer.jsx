// src/components/common/Footer.jsx
import React, { useContext } from 'react';
import { LanguageContext } from '../../App';

const Footer = () => {
  const { t } = useContext(LanguageContext);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-brand">
              <h3>AUTOMOTORS</h3>
              <p>{t.footer.company}</p>
            </div>
            <div className="footer-social">
              <h4>{t.footer.followUs}</h4>
              <div className="social-links">
                <a href="#" aria-label="Facebook">📘</a>
                <a href="#" aria-label="Twitter">🐦</a>
                <a href="#" aria-label="Instagram">📸</a>
                <a href="#" aria-label="LinkedIn">💼</a>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4>{t.footer.contact}</h4>
            <div className="contact-details">
              <div className="contact-item">
                <span className="icon">📞</span>
                <div>
                  <strong>{t.footer.phone}</strong>
                  {t.footer.phoneNumbers.map((number, index) => (
                    <p key={index}>
                      <a href={`tel:${number}`}>{number}</a>
                    </p>
                  ))}
                </div>
              </div>
              <div className="contact-item">
                <span className="icon">✉️</span>
                <div>
                  <strong>{t.footer.email}</strong>
                  <p>
                    <a href={`mailto:${t.footer.emailAddress}`}>
                      {t.footer.emailAddress}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Address & Delivery */}
          <div className="footer-section">
            <h4>{t.footer.address}</h4>
            <div className="address-details">
              <div className="contact-item">
                <span className="icon">📍</span>
                <div>
                  <strong>{t.footer.branches}</strong>
                  <p>{t.footer.mainAddress}</p>
                </div>
              </div>
              <div className="delivery-info">
                <span className="icon">🚚</span>
                <p>{t.footer.delivery}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} AUTOMOTORS. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;