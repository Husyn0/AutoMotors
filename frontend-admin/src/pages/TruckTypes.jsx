// src/pages/TruckTypes.jsx
import React from 'react';
import CrudPage from '../components/common/CrudPage';
import truckTypesApi from '../api/truckTypesApi';

const initialFormData = { name: '', models: '', icon: '', description: '' };

const fields = [
  { name: 'name', type: 'text', placeholder: 'Truck Type Name', required: true },
  { name: 'models', type: 'text', placeholder: 'Models (comma separated)', required: true },
  { name: 'icon', type: 'text', placeholder: 'Icon (emoji)' },
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
    key: 'icon',
    label: 'Icon',
    className: 'icon-cell',
    render: (t) => t.icon || '🚛',
  },
  { key: 'name', label: 'Name' },
  { key: 'models', label: 'Models' },
  { key: 'description', label: 'Description', className: 'description-cell' },
];

const TruckTypes = () => (
  <CrudPage
    title="Truck Types Management"
    entityName="Truck Type"
    entityNamePlural="truck type"
    api={truckTypesApi}
    initialFormData={initialFormData}
    fields={fields}
    columns={columns}
  />
);

export default TruckTypes;