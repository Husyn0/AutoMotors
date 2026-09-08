// src/api/data.js
// src/api/data.js - Updated services with icons
export const servicesData = {
  fr: {
    services: [
      {
        id: 1,
        title: 'Importation de pièces automobiles',
        description: 'Importation de pièces et équipements automobiles de qualité.',
        icon: '🚢'
      },
      {
        id: 2,
        title: 'Pneus pour véhicules et camions',
        description: 'Fourniture de pneus adaptés aux différents types de véhicules.',
        icon: '🚛'
      },
      {
        id: 3,
        title: 'Batteries automobiles',
        description: 'Vente de batteries fiables pour voitures et véhicules professionnels.',
        icon: '🔋'
      },
      {
        id: 4,
        title: 'Lubrifiants et huiles moteur',
        description: 'Distribution de lubrifiants et huiles moteur TOTAL.',
        icon: '🛢️'
      },
      {
        id: 5,
        title: 'Vente en gros',
        description: 'Fourniture de produits automobiles aux magasins, revendeurs et professionnels.',
        icon: '🏪'
      },
      {
        id: 6,
        title: 'Distribution en Côte d\'Ivoire',
        description: 'Distribution de nos produits dans différentes régions de la Côte d\'Ivoire.',
        icon: '🇨🇮'
      }
    ],
    advantages: [
      'Produits de qualité',
      'Prix compétitifs',
      'Importation fiable',
      'Large gamme de produits',
      'Distribution partout en Côte d\'Ivoire'
    ]
  },
  en: {
    services: [
      {
        id: 1,
        title: 'Automotive Parts Import',
        description: 'Import of quality automotive parts and equipment.',
        icon: '🚢'
      },
      {
        id: 2,
        title: 'Tires for Vehicles and Trucks',
        description: 'Supply of tires adapted to different types of vehicles.',
        icon: '🚛'
      },
      {
        id: 3,
        title: 'Automotive Batteries',
        description: 'Sale of reliable batteries for cars and commercial vehicles.',
        icon: '🔋'
      },
      {
        id: 4,
        title: 'Lubricants and Engine Oils',
        description: 'Distribution of TOTAL lubricants and engine oils.',
        icon: '🛢️'
      },
      {
        id: 5,
        title: 'Wholesale Sales',
        description: 'Supply of automotive products to shops, retailers and professionals.',
        icon: '🏪'
      },
      {
        id: 6,
        title: 'Distribution in Côte d\'Ivoire',
        description: 'Distribution of our products in different regions of Côte d\'Ivoire.',
        icon: '🇨🇮'
      }
    ],
    advantages: [
      'Quality products',
      'Competitive prices',
      'Reliable import',
      'Wide range of products',
      'Distribution throughout Côte d\'Ivoire'
    ]
  }
};

export const productsData = {
  fr: [
    { 
      id: 1, 
      name: 'Batterie Plomb 12V 60Ah', 
      category: 'batteries', 
      price: '€89.00',
      shortDescription: 'Batterie automobile fiable pour démarrage optimal',
      image: '/images/battery1.jpg'
    },
    { 
      id: 2, 
      name: 'Batterie Lithium 12V 80Ah', 
      category: 'batteries', 
      price: '€149.00',
      shortDescription: 'Batterie lithium haute performance pour véhicules modernes',
      image: '/images/battery2.jpg'
    },
    { 
      id: 3, 
      name: 'Huile Moteur 5W30 5L', 
      category: 'lubricants', 
      price: '€45.00',
      shortDescription: 'Huile synthétique haute performance pour moteurs essence',
      image: '/images/lubricant1.jpg'
    },
    { 
      id: 4, 
      name: 'Huile Moteur 10W40 5L', 
      category: 'lubricants', 
      price: '€38.00',
      shortDescription: 'Huile minérale pour moteurs diesel et essence',
      image: '/images/lubricant2.jpg'
    },
    { 
      id: 5, 
      name: 'Pneu Été 205/55R16', 
      category: 'tires', 
      price: '€120.00',
      shortDescription: 'Pneu été haute performance pour une conduite sécurisée',
      image: '/images/tire1.jpg'
    },
    { 
      id: 6, 
      name: 'Pneu Hiver 195/65R15', 
      category: 'tires', 
      price: '€135.00',
      shortDescription: 'Pneu hiver avec adhérence optimale sur neige',
      image: '/images/tire2.jpg'
    },
    { 
      id: 7, 
      name: 'Plaquettes Frein Avant', 
      category: 'spareParts', 
      price: '€65.00',
      shortDescription: 'Kit de plaquettes de frein de haute qualité',
      image: '/images/brake.jpg'
    },
    { 
      id: 8, 
      name: 'Filtre à Huile', 
      category: 'spareParts', 
      price: '€15.00',
      shortDescription: 'Filtre à huile haute efficacité pour moteur',
      image: '/images/oilfilter.jpg'
    }
  ],
  en: [
    { 
      id: 1, 
      name: 'Lead Battery 12V 60Ah', 
      category: 'batteries', 
      price: '€89.00',
      shortDescription: 'Reliable car battery for optimal starting',
      image: '/images/battery1.jpg'
    },
    { 
      id: 2, 
      name: 'Lithium Battery 12V 80Ah', 
      category: 'batteries', 
      price: '€149.00',
      shortDescription: 'High-performance lithium battery for modern vehicles',
      image: '/images/battery2.jpg'
    },
    { 
      id: 3, 
      name: 'Engine Oil 5W30 5L', 
      category: 'lubricants', 
      price: '€45.00',
      shortDescription: 'High-performance synthetic oil for petrol engines',
      image: '/images/lubricant1.jpg'
    },
    { 
      id: 4, 
      name: 'Engine Oil 10W40 5L', 
      category: 'lubricants', 
      price: '€38.00',
      shortDescription: 'Mineral oil for diesel and petrol engines',
      image: '/images/lubricant2.jpg'
    },
    { 
      id: 5, 
      name: 'Summer Tire 205/55R16', 
      category: 'tires', 
      price: '€120.00',
      shortDescription: 'High-performance summer tire for safe driving',
      image: '/images/tire1.jpg'
    },
    { 
      id: 6, 
      name: 'Winter Tire 195/65R15', 
      category: 'tires', 
      price: '€135.00',
      shortDescription: 'Winter tire with optimal snow traction',
      image: '/images/tire2.jpg'
    },
    { 
      id: 7, 
      name: 'Front Brake Pads', 
      category: 'spareParts', 
      price: '€65.00',
      shortDescription: 'High-quality brake pad kit',
      image: '/images/brake.jpg'
    },
    { 
      id: 8, 
      name: 'Oil Filter', 
      category: 'spareParts', 
      price: '€15.00',
      shortDescription: 'High-efficiency oil filter for engine',
      image: '/images/oilfilter.jpg'
    }
  ]
};

// src/api/data.js - Updated Truck Types
export const truckTypesData = {
  fr: [
    { 
      id: 1, 
      name: 'Camionnette', 
      models: 'Kia, Hyundai, Canter',
      icon: '🚐',
      description: 'Véhicules utilitaires légers pour le transport urbain'
    },
    { 
      id: 2, 
      name: 'Poids Lourds', 
      models: 'Mercedes, Sinotruck, DAF, Renault',
      icon: '🚛',
      description: 'Camions de transport et semi-remorques pour charges lourdes'
    }
  ],
  en: [
    { 
      id: 1, 
      name: 'Light Trucks', 
      models: 'Kia, Hyundai, Canter',
      icon: '🚐',
      description: 'Light utility vehicles for urban transport'
    },
    { 
      id: 2, 
      name: 'Heavy Trucks', 
      models: 'Mercedes, Sinotruck, DAF, Renault',
      icon: '🚛',
      description: 'Transport trucks and semi-trailers for heavy loads'
    }
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