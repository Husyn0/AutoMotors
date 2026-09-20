// src/pages/Categories.jsx
import React from 'react';
import CrudPage from '../components/common/CrudPage';
import categoriesApi from '../api/categoriesApi';
import uploadsApi from '../api/uploadsApi';

const initialFormData = {
  name: '',
  slug: '',
  icon: '',
  image: '',
  description: '',
};

const CATEGORY_ICON_OPTIONS = [
  { value: '🔋', label: 'Battery',            emoji: '🔋' },
  { value: '🛢️', label: 'Oil / Lubricant',   emoji: '🛢️' },
  { value: '🛞', label: 'Tire / Wheel',       emoji: '🛞' },
  { value: '🔧', label: 'Spare Parts',        emoji: '🔧' },
  { value: '⚙️', label: 'Engine / Parts',    emoji: '⚙️' },
  { value: '🔩', label: 'Bolts / Fittings',   emoji: '🔩' },
  { value: '💡', label: 'Lights / Electrical', emoji: '💡' },
  { value: '✨', label: 'Accessories',        emoji: '✨' },
  { value: '🧴', label: 'Fluids',             emoji: '🧴' },
  { value: '🪛', label: 'Tools',              emoji: '🪛' },
  { value: '🧰', label: 'Toolbox',            emoji: '🧰' },
  { value: '📦', label: 'Box / Misc',         emoji: '📦' },
];

const fields = [
  { name: 'name', type: 'text', placeholder: 'Category Name', required: true },
  { name: 'slug', type: 'text', placeholder: 'Slug (e.g. batteries)', required: true },
  {
    name: 'icon',
    type: 'select',
    placeholder: 'Icon',
    selectPlaceholder: 'Choose an icon…',
    emoji: true,
    options: CATEGORY_ICON_OPTIONS,
  },
  {
    name: 'image',
    type: 'image-upload',
    folder: 'categories',
    fullWidth: true,
  },
  {
    name: 'description',
    type: 'textarea',
    placeholder: 'Description',
    fullWidth: true,
  },
];

const columns = [
  {
    key: 'image',
    label: 'Image',
    className: 'thumb-cell',
    render: (c) => {
      const url = c.image_url || uploadsApi.resolveUrl(c.image);
      return url ? (
        <img src={url} alt={c.name} className="table-thumb" loading="lazy" />
      ) : (
        <span className="icon-cell">{c.icon || '📦'}</span>
      );
    },
  },
  { key: 'name', label: 'Name' },
  { key: 'slug', label: 'Slug' },
  { key: 'description', label: 'Description', className: 'description-cell' },
];

const Categories = () => (
  <CrudPage
    title="Categories Management"
    entityName="Category"
    entityNamePlural="category"
    api={categoriesApi}
    initialFormData={initialFormData}
    fields={fields}
    columns={columns}
  />
);

export default Categories;