// src/pages/Products.jsx
import React, { useEffect, useMemo, useState } from 'react';
import CrudPage from '../components/common/CrudPage';
import productsApi from '../api/productsApi';
import categoriesApi from '../api/categoriesApi';
import uploadsApi from '../api/uploadsApi';

const initialFormData = {
  name: '',
  category_id: '',
  price: '',
  short_description: '',
  image: '',
};

/**
 * Build the field list dynamically so the category <select>
 * reflects the live list returned by GET /api/categories.
 */
const buildFields = (categories) => [
  { name: 'name', type: 'text', placeholder: 'Product Name', required: true },
  {
    name: 'category_id',
    type: 'select',
    placeholder: 'Select Category',
    required: true,
    selectPlaceholder: 'Select Category',
    options: categories.map((c) => ({
      value: String(c.id),
      label: c.name,
      emoji: c.icon || undefined, // CrudForm renders `${emoji}  ${label}` when set
    })),
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

const Products = () => {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await categoriesApi.list();
        if (!cancelled) setCategories(res.data || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        if (!cancelled) setCategoriesLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const fields = useMemo(() => buildFields(categories), [categories]);

  return (
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
};

export default Products;