// src/components/sections/TruckTypes.jsx
import React, { useContext, useState, useRef, useEffect } from 'react';
import { LanguageContext } from '../../App';
import { truckTypesData } from '../../api/data';

const TruckTypes = () => {
  const { language, t } = useContext(LanguageContext);
  const truckTypes = truckTypesData[language];
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const scrollContainerRef = useRef(null);
  const autoScrollInterval = useRef(null);

  // Auto-scroll function
  const startAutoScroll = () => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
    }
    
    autoScrollInterval.current = setInterval(() => {
      if (scrollContainerRef.current && isAutoScrolling) {
        const container = scrollContainerRef.current;
        const scrollAmount = 350;
        
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
    }, 4000); // Scroll every 4 seconds
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

  // Initialize auto-scroll
  useEffect(() => {
    startAutoScroll();
    
    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, []);

  return (
    <section id="truckTypes" className="truck-types">
      <div className="container">
        <h2 className="section-title">{t.truckTypes.title}</h2>
        <p className="section-subtitle">{t.truckTypes.subtitle}</p>

        <div className="truck-scroll-wrapper">
          <button 
            className="scroll-btn scroll-left"
            onClick={() => handleManualScroll('left')}
            aria-label="Scroll left"
          >
            ‹
          </button>

          <div 
            className="truck-scroll-container"
            ref={scrollContainerRef}
            onMouseEnter={stopAutoScroll}
            onMouseLeave={resumeAutoScroll}
            onTouchStart={stopAutoScroll}
            onTouchEnd={() => setTimeout(resumeAutoScroll, 3000)}
          >
            <div className="truck-types-grid">
              {truckTypes.map((type) => (
                <div key={type.id} className="truck-card">
                  <div className="truck-icon-wrapper">
                    <span className="truck-icon">{type.icon}</span>
                  </div>
                  <div className="truck-info">
                    <h3 className="truck-name">{type.name}</h3>
                    <div className="truck-models">
                      <span className="models-label">Modèles :</span>
                      <span className="models-list">{type.models}</span>
                    </div>
                    <p className="truck-description">{type.description}</p>
                  </div>
                  <div className="truck-badge">
                    <span>{type.id === 1 ? '🚐' : '🚛'}</span>
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

        {/* Scroll indicator */}
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

export default TruckTypes;