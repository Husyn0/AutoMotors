import React from 'react';
import Layout from './components/layout/Layout';
import Home from './components/sections/Home';
import Services from './components/sections/Services';
import Products from './components/sections/Products';
import TruckTypes from './components/sections/TruckTypes';
import Projects from './components/sections/Projects';
import SecurityGuard from './components/common/SecurityGuard';
import { LanguageProvider } from './context/LanguageContext';
import { CategoriesProvider } from './context/CategoriesContext';
import './styles/main.scss';

export const LanguageContext = LanguageProvider.ctx; // keep old import path alive (optional)

function App() {
  return (
    <LanguageProvider>
      <CategoriesProvider>
        <SecurityGuard>
          <Layout>
            <Home />
            <Services />
            <Products />
            <TruckTypes />
            <Projects />
          </Layout>
        </SecurityGuard>
      </CategoriesProvider>
    </LanguageProvider>
  );
}

export default App;