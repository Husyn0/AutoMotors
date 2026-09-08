// src/App.jsx
import React, { useState, createContext } from 'react';
import Layout from './components/layout/Layout';
import Home from './components/sections/Home';
import Services from './components/sections/Services';
import Products from './components/sections/Products';
import TruckTypes from './components/sections/TruckTypes';
import Projects from './components/sections/Projects';
import SecurityGuard from './components/common/SecurityGuard';
import { translations } from './translations';
import './styles/main.scss';

export const LanguageContext = createContext();

function App() {
  const [language, setLanguage] = useState('fr');
  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <SecurityGuard>
        <Layout>
          <Home />
          <Services />
          <Products />
          <TruckTypes />
          <Projects />
        </Layout>
      </SecurityGuard>
    </LanguageContext.Provider>
  );
}

export default App;