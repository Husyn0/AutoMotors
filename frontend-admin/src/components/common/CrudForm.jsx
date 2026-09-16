// src/components/common/CrudForm.jsx
import React from 'react';
import { FaTimes } from 'react-icons/fa';
import FormField from './FormField';

const LOCALES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

const CrudForm = ({
  fields,
  formData,
  onChange,
  onSubmit,
  onCancel,
  isEditing,
  entityName,
  activeLocale,
  onLocaleChange,
  isTranslatable,
}) => {
  // For the active locale, build the list of visible fields.
  // - For 'fr' (base): use original field names + original values
  // - For 'en': prefix field names with 'en.' and read from that key
  const isBaseLocale = activeLocale === 'fr';

  const visibleFields = fields.filter((field) => {
    // Non-translatable fields (price, image, icon, category...) only show on FR tab
    if (!isTranslatable(field.name)) return isBaseLocale;
    return true;
  });

  return (
    <form className="content-form" id="crud-form" onSubmit={onSubmit}>
      <div className="form-header">
        <h2>{isEditing ? `Edit ${entityName}` : `New ${entityName}`}</h2>
        <button
          type="button"
          className="btn-cancel"
          onClick={onCancel}
          aria-label="Close form"
        >
          <FaTimes />
        </button>
      </div>

      {/* ── Language tabs ─────────────────────────────────────── */}
      <div className="locale-tabs">
        {LOCALES.map((loc) => (
          <button
            key={loc.code}
            type="button"
            className={`locale-tab ${activeLocale === loc.code ? 'active' : ''}`}
            onClick={() => onLocaleChange(loc.code)}
          >
            <span className="locale-flag">{loc.flag}</span>
            <span>{loc.label}</span>
          </button>
        ))}
      </div>

      <div className="form-grid">
        {visibleFields.map((field) => {
          // For EN tab, prefix the name so it maps to `en.<field>`
          const fieldName = isBaseLocale ? field.name : `${activeLocale}.${field.name}`;

          return (
            <FormField
              key={fieldName}
              {...field}
              name={fieldName}
              value={formData[fieldName]}
              onChange={onChange}
            />
          );
        })}

        <div className="form-actions full-width">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-submit">
            {isEditing ? 'Update' : 'Create'} {entityName}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CrudForm;