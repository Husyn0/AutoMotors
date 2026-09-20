// src/pages/Products.jsx
import React from 'react';
import CrudPage from '../components/common/CrudPage';
import productsApi from '../api/productsApi';

const initialFormData = {
  name: '',
  category_id: '',
  price: '',
  short_description: '',
  image: '',
};

const fields = [
  { name: 'name', type: 'text', placeholder: 'Product Name', required: true },

  // NOTE: still a static select for now — see follow-up task.
  // Value is the *id* (string), matching the FK column.
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
  { name: 'image', type: 'text', placeholder: 'Image URL' },

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
    key: 'category_id',
    label: 'Category',
    // Use category_id as the sort key, but render the nested category name.
    render: (p) => {
      const cat = p.category;
      if (!cat) return <span className="muted">—</span>;

      const slug = cat.slug || '';
      return (
        <span className={`category-badge ${slug}`}>
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