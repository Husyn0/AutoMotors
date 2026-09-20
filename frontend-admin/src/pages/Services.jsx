// src/pages/Services.jsx
import React from 'react';
import CrudPage from '../components/common/CrudPage';
import servicesApi from '../api/servicesApi';

const initialFormData = { title: '', type: 'srv', description: '' };

const fields = [
  { name: 'title', type: 'text', placeholder: 'Service Title', required: true },
  {
    name: 'type',
    type: 'select',
    placeholder: 'Type',
    required: true,
    selectPlaceholder: 'Select type',
    options: [
      { value: 'srv', label: 'Service (srv)' },
      { value: 'adv', label: 'Advantage (adv)' },
    ],
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
  { key: 'title', label: 'Title' },
  {
    key: 'type',
    label: 'Type',
    render: (s) => (
      <span className={`type-badge type-badge--${s.type}`}>
        {s.type === 'adv' ? 'Advantage' : 'Service'}
      </span>
    ),
  },
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