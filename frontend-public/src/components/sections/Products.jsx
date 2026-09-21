// src/components/sections/Products.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCategories } from '../../context/CategoriesContext';
import { productsData } from '../../api/data';
import { getProducts } from '../../api/endpoints';
import { useApi } from '../../hooks/useApi';

const Products = () => {
  const { language, t } = useLanguage();
  const { categories, loading: catsLoading } = useCategories();

  const { data, loading, error } = useApi(
    getProducts,
    [],
    productsData[language]
  );

  const products = Array.isArray(data)
    ? data
    : data?.data || productsData[language];

  const [activeCategory, setActiveCategory] = useState('all');
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const scrollContainerRef = useRef(null);
  const autoScrollInterval = useRef(null);

  // Build tabs: ["all", ...dbCategories]
  const categoryTabs = [
    { slug: 'all', name: t.products.categories.all },
    ...categories.map((c) => ({ slug: c.slug, name: c.name })),
  ];

  // Filter: match by nested category.slug, category_id, or legacy string
  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter((p) => {
          const slug =
            p.category?.slug ??
            p.category_slug ??
            (typeof p.category === 'string' ? p.category : null);
          if (slug) return slug === activeCategory;
          const catId = p.category_id ?? p.category?.id;
          const match = categories.find((c) => c.slug === activeCategory);
          return match && catId === match.id;
        });

  // --- auto-scroll logic unchanged from your version ---
  const startAutoScroll = () => {
    if (autoScrollInterval.current) clearInterval(autoScrollInterval.current);
    autoScrollInterval.current = setInterval(() => {
      if (scrollContainerRef.current && isAutoScrolling) {
        const c = scrollContainerRef.current;
        if (c.scrollLeft + c.clientWidth >= c.scrollWidth - 10) {
          c.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          c.scrollBy({ left: 300, behavior: 'smooth' });
        }
      }
    }, 3000);
  };

  const stopAutoScroll = () => {
    if (autoScrollInterval.current) clearInterval(autoScrollInterval.current);
    autoScrollInterval.current = null;
    setIsAutoScrolling(false);
  };

  const resumeAutoScroll = () => {
    setIsAutoScrolling(true);
    startAutoScroll();
  };

  const handleManualScroll = (direction) => {
    stopAutoScroll();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -400 : 400,
        behavior: 'smooth',
      });
    }
    setTimeout(() => { if (!isAutoScrolling) resumeAutoScroll(); }, 5000);
  };

  const handleCategoryChange = (slug) => {
    setActiveCategory(slug);
    scrollContainerRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
    stopAutoScroll();
    setTimeout(resumeAutoScroll, 1000);
  };

  useEffect(() => { startAutoScroll(); return () => clearInterval(autoScrollInterval.current); }, []);
  useEffect(() => { stopAutoScroll(); setTimeout(resumeAutoScroll, 1000); }, [activeCategory]);

  if (loading || catsLoading) return <div className="loader">Loading products…</div>;

  // Helper to get a display label for a product's category chip
  const labelForProduct = (product) => {
    const slug =
      product.category?.slug ??
      (typeof product.category === 'string' ? product.category : null);
    const found = categories.find((c) => c.slug === slug);
    return found?.name || product.category?.name || slug || '';
  };

  return (
    <section id="products" className="products">
      <div className="container">
        <h2 className="section-title">{t.products.title}</h2>
        <p className="section-subtitle">{t.products.subtitle}</p>

        {/* Dynamic category tabs */}
        <div className="category-nav">
          {categoryTabs.map(({ slug, name }) => (
            <button
              key={slug}
              className={`category-btn ${activeCategory === slug ? 'active' : ''}`}
              onClick={() => handleCategoryChange(slug)}
            >
              {name}
              {activeCategory === slug && <span className="active-indicator" />}
            </button>
          ))}
        </div>

        <div className="products-scroll-wrapper">
          <button className="scroll-btn scroll-left" onClick={() => handleManualScroll('left')} aria-label="Scroll left">‹</button>

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
                    {product.image_url || product.image ? (
                      <img
                        src={product.image_url || product.image}
                        alt={product.name}
                        loading="lazy"
                      />
                    ) : (
                      <div className="product-placeholder">📦</div>
                    )}
                  </div>
                  <div className="product-category">{labelForProduct(product)}</div>
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.short_description}</p>
                  <div className="product-footer">
                    <span className="product-price">{product.price}</span>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <p className="empty-state">Aucun produit dans cette catégorie.</p>
              )}
            </div>
          </div>

          <button className="scroll-btn scroll-right" onClick={() => handleManualScroll('right')} aria-label="Scroll right">›</button>
        </div>

        <div className="scroll-indicator">
          <span className={`scroll-dot ${isAutoScrolling ? 'active' : ''}`} />
          <span className="scroll-text">
            {isAutoScrolling ? 'Défilement automatique' : 'Défilement manuel'}
          </span>
        </div>
      </div>
    </section>
  );
};

export default Products;