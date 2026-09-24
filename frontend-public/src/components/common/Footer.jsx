// src/components/common/Footer.jsx
import React, { useContext } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import logo from '../../assets/output/logo1.ico';  // 👈 ADD THIS

import { getSettings } from '../../api/endpoints';
import { useApi } from '../../hooks/useApi';

import { FaSquareXTwitter } from "react-icons/fa6";
import { FaInstagramSquare, FaFacebook, FaLinkedin } from "react-icons/fa";
import { MdMyLocation } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { BsFillPhoneVibrateFill } from "react-icons/bs";
import { IoIosMailOpen } from "react-icons/io";

const Footer = () => {

  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const { data: settings } = useApi(getSettings, [], null);

  const phoneNumbers = settings?.phoneNumbers || t.footer.phoneNumbers;
  const email = settings?.emailAddress || t.footer.emailAddress;
  const address = settings?.mainAddress || t.footer.mainAddress;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-brand">
              {/* 👇 ADD THIS LOGO BLOCK */}
              <img 
                src={logo} 
                alt="AUTOMOTORS" 
                className="footer-logo"
              />
              <h3>AUTOMOTORS</h3>
              <p>{t.footer.company}</p>
            </div>
            <div className="footer-social">
              <h4>{t.footer.followUs}</h4>
              <div className="social-links">
                <a href="#" aria-label="Facebook"><FaFacebook /></a>
                <a href="#" aria-label="Twitter"><FaSquareXTwitter /></a>
                <a href="#" aria-label="Instagram"><FaInstagramSquare /></a>
                <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4>{t.footer.contact}</h4>
            <div className="contact-details">
              <div className="contact-item">
                <span className="icon"><BsFillPhoneVibrateFill /></span>
                <div>
                  <strong>{t.footer.phone}</strong>
                  {phoneNumbers.map((number, index) => (
                    <p key={index}>
                      <a href={`tel:${number}`}>{number}</a>
                    </p>
                  ))}
                </div>
              </div>
              <div className="contact-item">
                <span className="icon"><IoIosMailOpen /></span>
                <div>
                  <strong>{t.footer.email}</strong>
                  <p>
                    <a href={`mailto:${email}`}>
                      {email}
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
                <span className="icon"><MdMyLocation /></span>
                <div>
                  <strong>{t.footer.branches}</strong>
                  <p>{address}</p>
                </div>
              </div>
              <div className="delivery-info">
                <span className="icon"><TbTruckDelivery /></span>
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