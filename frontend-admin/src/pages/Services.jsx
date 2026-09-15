// src/pages/Services.jsx
import React from 'react';
import CrudPage from '../components/common/CrudPage';
import servicesApi from '../api/servicesApi';

const initialFormData = { title: '', description: '', icon: '' };

const fields = [
  { name: 'title', type: 'text', placeholder: 'Service Title', required: true },
  {
    name: 'description',
    type: 'textarea',
    placeholder: 'Description',
    required: true,
    fullWidth: true,
  },
];

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'description', label: 'Description', className: 'description-cell' },
];

const Services = () => (
  <CrudPage
    title="Services Management"
    entityName="Service"
    entityNamePlural="service"
    api={servicesApi}
    initialFormData={initialFormData}
    fields={fields}
    columns={columns}
  />
);

export default Services;