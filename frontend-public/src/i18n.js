// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      'auto_motors': 'AUTO MOTORS SARL',
      'about': 'À Propos',
      'services': 'Services',
      'products': 'Produits',
      'contact': 'Contact',
      'mission': 'Mission',
      'vision': 'Vision',
      'location': 'Localisation',
      'delivery': 'Livraison',
      'faq': 'FAQ',
      'phone': 'Téléphone',
      'email': 'Email',
      'advantages': 'Nos Avantages',
      'vehicle_types': 'Types de Véhicules',
      // ... add all translations
    }
  },
  en: {
    translation: {
      'auto_motors': 'AUTO MOTORS SARL',
      'about': 'About',
      'services': 'Services',
      'products': 'Products',
      'contact': 'Contact',
      'mission': 'Mission',
      'vision': 'Vision',
      'location': 'Location',
      'delivery': 'Delivery',
      'faq': 'FAQ',
      'phone': 'Phone',
      'email': 'Email',
      'advantages': 'Our Advantages',
      'vehicle_types': 'Vehicle Types',
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('lang') || 'fr',
  fallbackLng: 'fr',
  interpolation: { escapeValue: false }
});

export default i18n;