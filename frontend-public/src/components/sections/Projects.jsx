// src/components/sections/Projects.jsx
import React, { useContext, useState, useRef, useEffect } from 'react';
import { LanguageContext } from '../../App';
import { projectsData } from '../../api/data';
import { getProjects } from '../../api/endpoints';
import { useApi } from '../../hooks/useApi';

const Projects = () => {
  const { language, t } = useContext(LanguageContext);
  const { data, loading } = useApi(getProjects, [], projectsData[language]);

  const projects = Array.isArray(data)
    ? data
    : data?.data || projectsData[language];

  const scrollContainerRef = useRef(null);
  const autoScrollInterval = useRef(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0); // which dot is active

  // ---- Compute "pages" (how many dots) ----
  // Each "page" is a card. If you want pages of 2 cards, adjust below.
  const totalPages = projects.length;

  // ---- Scroll to a specific card ----
  const scrollToIndex = (index) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const card = container.querySelectorAll('.project-card')[index];
    if (card) {
      container.scrollTo({
        left: card.offsetLeft - container.offsetLeft,
        behavior: 'smooth',
      });
      setActiveIndex(index);
    }
  };

  // ---- Detect the currently visible card while scrolling ----
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const cards = container.querySelectorAll('.project-card');
    const containerLeft = container.scrollLeft;
    const containerCenter = containerLeft + container.clientWidth / 2;

    let closest = 0;
    let closestDist = Infinity;
    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(cardCenter - containerCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    setActiveIndex(closest);
  };

  // ---- Auto-scroll (advances one card at a time) ----
  const startAutoScroll = () => {
    if (autoScrollInterval.current) clearInterval(autoScrollInterval.current);

    autoScrollInterval.current = setInterval(() => {
      if (!scrollContainerRef.current || !isAutoScrolling) return;
      const next = (activeIndex + 1) % totalPages;
      scrollToIndex(next);
    }, 4000);
  };

  const stopAutoScroll = () => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
      autoScrollInterval.current = null;
    }
    setIsAutoScrolling(false);
  };

  const resumeAutoScroll = () => {
    setIsAutoScrolling(true);
    startAutoScroll();
  };

  // Start / stop auto-scroll based on state
  useEffect(() => {
    if (isAutoScrolling) startAutoScroll();
    return () => {
      if (autoScrollInterval.current) clearInterval(autoScrollInterval.current);
    };
  }, [isAutoScrolling, activeIndex]);

  // Pause when user manually swipes, resume after a delay
  const handleTouchStart = () => stopAutoScroll();
  const handleTouchEnd = () => setTimeout(resumeAutoScroll, 3000);

  if (loading) return <div className="loader">Loading projects…</div>;

  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2 className="section-title">{t.projects.title}</h2>
        <p className="section-subtitle">{t.projects.subtitle}</p>

        <div className="projects-scroll-wrapper">
          <div
            className="projects-scroll-container"
            ref={scrollContainerRef}
            onScroll={handleScroll}
            onMouseEnter={stopAutoScroll}
            onMouseLeave={resumeAutoScroll}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="projects-track">
              {projects.map((project) => (
                <div key={project.id} className="project-card">
                  <div className="project-image">{project.image}</div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ✅ Pagination dots below */}
        <div className="projects-dots" role="tablist" aria-label="Project pagination">
          {projects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              className={`dot ${activeIndex === index ? 'active' : ''}`}
              onClick={() => {
                stopAutoScroll();
                scrollToIndex(index);
                setTimeout(resumeAutoScroll, 3000);
              }}
              aria-label={`Go to project ${index + 1}`}
              aria-selected={activeIndex === index}
              role="tab"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;