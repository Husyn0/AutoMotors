// src/components/sections/Projects.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { projectsData } from '../../api/data';
import { getProjects } from '../../api/endpoints';
import { useApi } from '../../hooks/useApi';
import { resolveImage } from '../../api/media';

const Projects = () => {
  const { language, t } = useLanguage();
  const { data, loading } = useApi(getProjects, [], projectsData[language]);

  const projects = Array.isArray(data)
    ? data
    : data?.data || projectsData[language];

  const scrollContainerRef = useRef(null);
  const autoScrollInterval = useRef(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);

  const totalPages = projects.length;

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

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const cards = container.querySelectorAll('.project-card');
    const center = container.scrollLeft + container.clientWidth / 2;
    let closest = 0;
    let closestDist = Infinity;
    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const d = Math.abs(cardCenter - center);
      if (d < closestDist) {
        closestDist = d;
        closest = i;
      }
    });
    setActiveIndex(closest);
  };

  const startAutoScroll = () => {
    if (autoScrollInterval.current) clearInterval(autoScrollInterval.current);
    autoScrollInterval.current = setInterval(() => {
      if (!scrollContainerRef.current || !isAutoScrolling) return;
      scrollToIndex((activeIndex + 1) % totalPages);
    }, 4000);
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

  useEffect(() => {
    if (isAutoScrolling) startAutoScroll();
    return () => {
      if (autoScrollInterval.current) clearInterval(autoScrollInterval.current);
    };
  }, [isAutoScrolling, activeIndex]);

  useEffect(() => {
    if (!selectedProject) return;
    const onKey = (e) => e.key === 'Escape' && setSelectedProject(null);
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [selectedProject]);

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
            onTouchStart={stopAutoScroll}
            onTouchEnd={() => setTimeout(resumeAutoScroll, 3000)}
          >
            <div className="projects-track">
              {projects.map((project) => {
                const imgSrc = resolveImage(project);
                return (
                  <div
                    key={project.id}
                    className="project-card"
                    onClick={() => setSelectedProject(project)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedProject(project);
                      }
                    }}
                  >
                    <div className="project-image">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={project.title}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement?.classList.add('is-fallback');
                          }}
                        />
                      ) : (
                        <span className="project-emoji">
                          {project.image || '🖼️'}
                        </span>
                      )}
                    </div>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

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

      {selectedProject && (
        <div
          className="project-modal-overlay"
          onClick={() => setSelectedProject(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedProject.title}
        >
          <div
            className="project-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="project-modal-close"
              onClick={() => setSelectedProject(null)}
              aria-label="Close"
            >
              ×
            </button>

            <div className="project-modal-media">
              {(() => {
                const src = resolveImage(selectedProject);
                return src ? (
                  <img
                    src={src}
                    alt={selectedProject.title}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement?.classList.add('is-fallback');
                    }}
                  />
                ) : (
                  <span className="project-modal-emoji">
                    {selectedProject.image || '🖼️'}
                  </span>
                );
              })()}
            </div>

            <div className="project-modal-info">
              <h3>{selectedProject.title}</h3>
              <p>{selectedProject.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;