// src/api/data.js
export const servicesData = {
  fr: [
    {
      id: 1,
      title: 'Vente de Batteries',
      description: 'Large gamme de batteries pour tous types de véhicules',
      icon: '🔋'
    },
    {
      id: 2,
      title: 'Lubrifiants',
      description: 'Huiles moteur et graisses de haute qualité',
      icon: '🛢️'
    },
    {
      id: 3,
      title: 'Pneus',
      description: 'Tous types de pneus pour véhicules légers et poids lourds',
      icon: '⚙️'
    },
    {
      id: 4,
      title: 'Pièces Détachées',
      description: 'Stock important de pièces d\'origine et adaptables',
      icon: '🔧'
    }
  ],
  en: [
    {
      id: 1,
      title: 'Battery Sales',
      description: 'Wide range of batteries for all vehicle types',
      icon: '🔋'
    },
    {
      id: 2,
      title: 'Lubricants',
      description: 'High-quality engine oils and greases',
      icon: '🛢️'
    },
    {
      id: 3,
      title: 'Tires',
      description: 'All types of tires for light and heavy vehicles',
      icon: '⚙️'
    },
    {
      id: 4,
      title: 'Spare Parts',
      description: 'Large stock of original and compatible parts',
      icon: '🔧'
    }
  ]
};

export const productsData = {
  fr: [
    { id: 1, name: 'Batteries Plomb', category: 'batteries', price: '€' },
    { id: 2, name: 'Batteries Lithium', category: 'batteries', price: '€€' },
    { id: 3, name: 'Huile Moteur 5W30', category: 'lubricants', price: '€' },
    { id: 4, name: 'Huile Moteur 10W40', category: 'lubricants', price: '€' },
    { id: 5, name: 'Pneus Été', category: 'tires', price: '€€' },
    { id: 6, name: 'Pneus Hiver', category: 'tires', price: '€€' },
    { id: 7, name: 'Plaquettes Frein', category: 'spareParts', price: '€' },
    { id: 8, name: 'Filtres à Huile', category: 'spareParts', price: '€' }
  ],
  en: [
    { id: 1, name: 'Lead Batteries', category: 'batteries', price: '€' },
    { id: 2, name: 'Lithium Batteries', category: 'batteries', price: '€€' },
    { id: 3, name: 'Engine Oil 5W30', category: 'lubricants', price: '€' },
    { id: 4, name: 'Engine Oil 10W40', category: 'lubricants', price: '€' },
    { id: 5, name: 'Summer Tires', category: 'tires', price: '€€' },
    { id: 6, name: 'Winter Tires', category: 'tires', price: '€€' },
    { id: 7, name: 'Brake Pads', category: 'spareParts', price: '€' },
    { id: 8, name: 'Oil Filters', category: 'spareParts', price: '€' }
  ]
};

export const truckTypesData = {
  fr: [
    { id: 1, name: 'Poids Lourds', icon: '🚛' },
    { id: 2, name: 'Véhicules Utilitaires', icon: '🚐' },
    { id: 3, name: 'Véhicules Légers', icon: '🚗' },
    { id: 4, name: 'Engins de Chantier', icon: '🏗️' }
  ],
  en: [
    { id: 1, name: 'Heavy Trucks', icon: '🚛' },
    { id: 2, name: 'Utility Vehicles', icon: '🚐' },
    { id: 3, name: 'Light Vehicles', icon: '🚗' },
    { id: 4, name: 'Construction Equipment', icon: '🏗️' }
  ]
};

export const projectsData = {
  fr: [
    {
      id: 1,
      title: 'Flotte de Transport',
      description: 'Équipement complet pour une flotte de 50 camions',
      image: '🚛'
    },
    {
      id: 2,
      title: 'Station Service',
      description: 'Fourniture de lubrifiants pour une station-service',
      image: '⛽'
    },
    {
      id: 3,
      title: 'Garage Partenaire',
      description: 'Approvisionnement en pièces détachées pour un garage',
      image: '🔧'
    }
  ],
  en: [
    {
      id: 1,
      title: 'Transport Fleet',
      description: 'Complete equipment for a fleet of 50 trucks',
      image: '🚛'
    },
    {
      id: 2,
      title: 'Service Station',
      description: 'Lubricant supply for a service station',
      image: '⛽'
    },
    {
      id: 3,
      title: 'Partner Garage',
      description: 'Spare parts supply for a garage',
      image: '🔧'
    }
  ]
};