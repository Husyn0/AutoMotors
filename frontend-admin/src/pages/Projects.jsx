// src/pages/Projects.jsx
import React from 'react';
import CrudPage from '../components/common/CrudPage';
import projectsApi from '../api/projectsApi';

const initialFormData = { title: '', description: '', image: '' };

const fields = [
  { name: 'title', type: 'text', placeholder: 'Project Title', required: true },
  { name: 'image', type: 'text', placeholder: 'Image URL or Emoji' },
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
    className: 'icon-cell',
    render: (p) => p.image || '📁',
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