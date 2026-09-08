// src/components/sections/Products.jsx
import React, { useContext, useState, useRef, useEffect } from 'react';
import { LanguageContext } from '../../App';
import { productsData } from '../../api/data';

const Products = () => {
  const { language, t } = useContext(LanguageContext);
  const products = productsData[language];
  const [activeCategory, setActiveCategory] = useState('all');
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const scrollContainerRef = useRef(null);
  const autoScrollInterval = useRef(null);

  const categories = {
    all: t.products.categories.all,
    batteries: t.products.categories.batteries,
    lubricants: t.products.categories.lubricants,
    tires: t.products.categories.tires,
    spareParts: t.products.categories.spareParts
  };

  // Filter products based on category
  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  // Auto-scroll function
  const startAutoScroll = () => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
    }
    
    autoScrollInterval.current = setInterval(() => {
      if (scrollContainerRef.current && isAutoScrolling) {
        const container = scrollContainerRef.current;
        const scrollAmount = 300; // Scroll 300px at a time
        
        // Check if we're at the end
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
          // Reset to start
          container.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
        } else {
          // Scroll forward
          container.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
          });
        }
      }
    }, 3000); // Scroll every 3 seconds
  };

  // Stop auto-scroll
  const stopAutoScroll = () => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
      autoScrollInterval.current = null;
    }
    setIsAutoScrolling(false);
  };

  // Resume auto-scroll
  const resumeAutoScroll = () => {
    setIsAutoScrolling(true);
    startAutoScroll();
  };

  // Handle manual scroll
  const handleManualScroll = (direction) => {
    stopAutoScroll();
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = 400;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
    // Resume auto-scroll after 5 seconds of inactivity
    setTimeout(() => {
      if (!isAutoScrolling) {
        resumeAutoScroll();
      }
    }, 5000);
  };

  // Handle category filter change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    // Reset scroll position
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
    }
    // Restart auto-scroll
    stopAutoScroll();
    setTimeout(() => resumeAutoScroll(), 1000);
  };

  // Initialize auto-scroll
  useEffect(() => {
    startAutoScroll();
    
    // Cleanup interval on unmount
    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, []);

  // Restart auto-scroll when filtered products change
  useEffect(() => {
    stopAutoScroll();
    setTimeout(() => resumeAutoScroll(), 1000);
  }, [activeCategory]);

  return (
    <section id="products" className="products">
      <div className="container">
        <h2 className="section-title">{t.products.title}</h2>
        <p className="section-subtitle">{t.products.subtitle}</p>

        {/* Category Navigation */}
        <div className="category-nav">
          {Object.entries(categories).map(([key, label]) => (
            <button
              key={key}
              className={`category-btn ${activeCategory === key ? 'active' : ''}`}
              onClick={() => handleCategoryChange(key)}
            >
              {label}
              {activeCategory === key && <span className="active-indicator"></span>}
            </button>
          ))}
        </div>

        {/* Products Container */}
        <div className="products-scroll-wrapper">
          <button 
            className="scroll-btn scroll-left"
            onClick={() => handleManualScroll('left')}
            aria-label="Scroll left"
          >
            ‹
          </button>

          <div 
            className="products-scroll-container"
            ref={scrollContainerRef}
            onMouseEnter={stopAutoScroll}
            onMouseLeave={resumeAutoScroll}
            onTouchStart={stopAutoScroll}
            onTouchEnd={() => setTimeout(resumeAutoScroll, 3000)}
          >
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    {product.image ? (
                      <img src={product.image} alt={product.name} />
                    ) : (
                      <div className="product-placeholder">📦</div>
                    )}
                  </div>
                  <div className="product-category">
                    {categories[product.category]}
                  </div>
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.shortDescription}</p>
                  <div className="product-footer">
                    <span className="product-price">{product.price}</span>
                    <button className="product-btn">+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            className="scroll-btn scroll-right"
            onClick={() => handleManualScroll('right')}
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>

        {/* Auto-scroll indicator */}
        <div className="scroll-indicator">
          <span className={`scroll-dot ${isAutoScrolling ? 'active' : ''}`}></span>
          <span className="scroll-text">
            {isAutoScrolling ? 'Défilement automatique' : 'Défilement manuel'}
          </span>
        </div>
      </div>
    </section>
  );
};

export default Products;