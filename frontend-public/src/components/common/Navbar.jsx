// src/components/common/Navbar.jsx
import React, { useState, useContext } from 'react';
import { LanguageContext } from '../../App';
import LanguageToggle from './LanguageToggle';
import logo from '../../assets/output/logo1.ico';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useContext(LanguageContext);

  const navItems = [
    { id: 'home', label: t.nav.home },
    { id: 'services', label: t.nav.services },
    { id: 'products', label: t.nav.products },
    { id: 'truckTypes', label: t.nav.truckTypes },
    { id: 'projects', label: t.nav.projects },
    { id: 'contact', label: t.nav.contact }
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => scrollToSection('home')}>
          <span className="logo-icon">
            <img src={logo} alt="AUTOMOTORS" style={
              {
                width: 100,
                borderRadius:230 
              }
              }/>

            </span>
          <span className="logo-text">AUTOMOTORS</span>
        </div>

        <div className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <li key={item.id}>
              <button onClick={() => scrollToSection(item.id)}>
                {item.label}
              </button>
            </li>
          ))}
          <li>
            <LanguageToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;