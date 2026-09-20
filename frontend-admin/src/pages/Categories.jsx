// src/pages/Categories.jsx
import React from 'react';
import CrudPage from '../components/common/CrudPage';
import categoriesApi from '../api/categoriesApi';

const initialFormData = {
  name: '',
  slug: '',
  icon: '',
  image: '',
  description: '',
};

/* Curated emoji set for automotive categories. */
const CATEGORY_ICON_OPTIONS = [
  { value: '🔋', label: 'Battery',           emoji: '🔋' },
  { value: '🛢️', label: 'Oil / Lubricant',  emoji: '🛢️' },
  { value: '🛞', label: 'Tire / Wheel',      emoji: '🛞' },
  { value: '🔧', label: 'Spare Parts',       emoji: '🔧' },
  { value: '⚙️', label: 'Engine / Parts',   emoji: '⚙️' },
  { value: '🔩', label: 'Bolts / Fittings',  emoji: '🔩' },
  { value: '💡', label: 'Lights / Electrical', emoji: '💡' },
  { value: '✨', label: 'Accessories',       emoji: '✨' },
  { value: '🧴', label: 'Fluids',            emoji: '🧴' },
  { value: '🪛', label: 'Tools',             emoji: '🪛' },
  { value: '🧰', label: 'Toolbox',           emoji: '🧰' },
  { value: '📦', label: 'Box / Misc',        emoji: '📦' },
];

const fields = [
  { name: 'name', type: 'text', placeholder: 'Category Name', required: true },

  {
    name: 'slug',
    type: 'text',
    placeholder: 'Slug (e.g. batteries)',
    required: true,
  },

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
    type: 'text',
    placeholder: 'Image URL or path',
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
    key: 'icon',
    label: 'Icon',
    className: 'icon-cell',
    render: (c) => c.icon || '📦',
  },
  { key: 'name', label: 'Name' },
  { key: 'slug', label: 'Slug' },
  {
    key: 'description',
    label: 'Description',
    className: 'description-cell',
  },
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