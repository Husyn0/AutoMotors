// src/pages/Products.jsx
import React from 'react';
import CrudPage from '../components/common/CrudPage';
import productsApi from '../api/productsApi';
import uploadsApi from '../api/uploadsApi';

const initialFormData = {
  name: '',
  category_id: '',
  price: '',
  short_description: '',
  image: '',
};

const fields = [
  { name: 'name', type: 'text', placeholder: 'Product Name', required: true },
  {
    name: 'category_id',
    type: 'select',
    placeholder: 'Select Category',
    required: true,
    selectPlaceholder: 'Select Category',
    options: [
      { value: '1', label: 'Batteries Auto' },
      { value: '2', label: 'Lubrifiants' },
      { value: '3', label: 'Pneus' },
      { value: '4', label: 'Pièces détachées' },
      { value: '6', label: 'Accessoires' },
    ],
  },
  { name: 'price', type: 'number', placeholder: 'Price', required: true },
  {
    name: 'image',
    type: 'image-upload',
    folder: 'products',
    fullWidth: true,
  },
  {
    name: 'short_description',
    type: 'textarea',
    placeholder: 'Short Description',
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
      return url ? (
        <img src={url} alt={p.name} className="table-thumb" loading="lazy" />
      ) : (
        <span className="muted">—</span>
      );
    },
  },
  { key: 'name', label: 'Name' },
  {
    key: 'category_id',
    label: 'Category',
    render: (p) => {
      const cat = p.category;
      if (!cat) return <span className="muted">—</span>;
      return (
        <span className={`category-badge ${cat.slug || ''}`}>
          {cat.icon ? `${cat.icon} ` : ''}
          {cat.name}
        </span>
      );
    },
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