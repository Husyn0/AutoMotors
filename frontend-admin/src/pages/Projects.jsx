// src/pages/Projects.jsx
import React from 'react';
import CrudPage from '../components/common/CrudPage';
import projectsApi from '../api/projectsApi';
import uploadsApi from '../api/uploadsApi';

const initialFormData = {
  title: '',
  description: '',
  image: '',
};

const fields = [
  { name: 'title', type: 'text', placeholder: 'Project Title', required: true },
  {
    name: 'image',
    type: 'image-upload',
    folder: 'projects',
    fullWidth: true,
  },
  {
    name: 'description',
    type: 'textarea',
    placeholder: 'Description',
    required: true,
    fullWidth: true,
  },
];

const columns = [
  {
    key: 'image',
    label: 'Image',
    className: 'thumb-cell',
    render: (p) => {
      const url = p.image_url || uploadsApi.resolveUrl(p.image);
      if (url) {
        return <img src={url} alt={p.title} className="table-thumb" loading="lazy" />;
      }
      // Legacy emoji row (e.g. "⛽")
      return <span className="icon-cell">{p.image || '📁'}</span>;
    },
  },
  { key: 'title', label: 'Title' },
  { key: 'description', label: 'Description', className: 'description-cell' },
];

const Projects = () => (
  <CrudPage
    title="Projects Management"
    entityName="Project"
    entityNamePlural="project"
    api={projectsApi}
    initialFormData={initialFormData}
    fields={fields}
    columns={columns}
  />
);

export default Projects;