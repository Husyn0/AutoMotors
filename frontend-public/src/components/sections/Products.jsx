// src/components/sections/Products.jsx
import React, { useContext } from 'react';
import { LanguageContext } from '../../App';
import { productsData } from '../../api/data';

const Products = () => {
  const { language, t } = useContext(LanguageContext);
  const products = productsData[language];

  const categories = {
    batteries: t.products.categories.batteries,
    lubricants: t.products.categories.lubricants,
    tires: t.products.categories.tires,
    spareParts: t.products.categories.spareParts
  };

  return (
    <section id="products" className="products">
      <div className="container">
        <h2 className="section-title">{t.products.title}</h2>
        <p className="section-subtitle">{t.products.subtitle}</p>
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-category">
                {categories[product.category]}
              </div>
              <h3>{product.name}</h3>
              <div className="product-price">{product.price}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;