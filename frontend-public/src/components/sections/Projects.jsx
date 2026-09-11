// src/components/sections/Projects.jsx
import React, { useContext } from 'react';
import { LanguageContext } from '../../App';
import { projectsData } from '../../api/data';
import { getProjects } from '../../api/endpoints';    // API
import { useApi } from '../../hooks/useApi';

const Projects = () => {
  const { language, t } = useContext(LanguageContext);
  const { data, loading } = useApi(getProjects, [], projectsData[language]);

  const projects = Array.isArray(data)
    ? data
    : data?.data || projectsData[language];

  if (loading) return <div className="loader">Loading projects…</div>;

  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2 className="section-title">{t.projects.title}</h2>
        <p className="section-subtitle">{t.projects.subtitle}</p>
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-image">{project.image}</div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;