// src/components/common/Navbar.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext'
import LanguageToggle from './LanguageToggle';
import logo from '../../assets/output/logo1.ico';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { t } = useLanguage();

  const navItems = [
    { id: 'home', label: t.nav.home },
    { id: 'services', label: t.nav.services },
    { id: 'products', label: t.nav.products },
    { id: 'truckTypes', label: t.nav.truckTypes },
    { id: 'projects', label: t.nav.projects }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;
          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            setActiveSection(navItems[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* LEFT: Logo */}
        <div className="navbar-logo" onClick={() => scrollToSection('home')}>
          <span className="logo-icon">
            <img src={logo} style={{ width: 100 }} alt="AUTOMOTORS" />
          </span>
          <span className="logo-text">AUTOMOTORS</span>
        </div>

        {/* CENTER: Nav links */}
        <ul className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToSection(item.id)}
                className={activeSection === item.id ? 'active' : ''}
              >
                {item.label}
                {activeSection === item.id && <span className="active-indicator"></span>}
              </button>
            </li>
          ))}

          {/* ✅ Language toggle INSIDE the mobile dropdown */}
          <li className="navbar-lang-mobile">
            <LanguageToggle />
          </li>
        </ul>

        {/* RIGHT: Language toggle (desktop only) */}
        <div className="navbar-lang">
          <LanguageToggle />
        </div>

        {/* Mobile hamburger */}
        <div className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;