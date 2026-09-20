// src/pages/Products.jsx
import React from 'react';
import CrudPage from '../components/common/CrudPage';
import productsApi from '../api/productsApi';

const initialFormData = {
  name: '',
  category: '',
  price: '',
  short_description: '',
  image: '',
};

const fields = [
  { name: 'name', type: 'text', placeholder: 'Product Name', required: true },
  {
    name: 'category',
    type: 'select',
    placeholder: 'Select Category',
    required: true,
    selectPlaceholder: 'Select Category',
    options: [
      { value: 'batteries', label: 'batteries' },
      { value: 'lubricants', label: 'lubricants' },
      { value: 'tires', label: 'tires' },
      { value: 'spareParts', label: 'spareParts' },
    ],
  },
  { name: 'price', type: 'number', placeholder: 'Price', required: true },
  { name: 'image', type: 'file', placeholder: 'Image URL' },
  {
    name: 'short_description',
    type: 'textarea',
    placeholder: 'Short Description',
    required: true,
    fullWidth: true,
  },
];

const columns = [
  { key: 'name', label: 'Name' },
  {
    key: 'category',
    label: 'Category',
    render: (p) => <span className={`category-badge ${p.category}`}>{p.category}</span>,
  },
  { key: 'price', label: 'Price', render: (p) => `€${p.price}` },
  { key: 'short_description', label: 'Description', className: 'description-cell' },
];

const Products = () => (
  <CrudPage
    title="Products Management"
    entityName="Product"
    entityNamePlural="product"
    api={productsApi}
    initialFormData={initialFormData}
    fields={fields}
    columns={columns}
  />
);

export default Products;