// src/components/common/CrudForm.jsx
import React from 'react';
import { FaTimes } from 'react-icons/fa';
import FormField from './FormField';

const CrudForm = ({
  fields,
  formData,
  onChange,
  onSubmit,
  onCancel,
  isEditing,
  entityName,
}) => {
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

      <div className="form-grid">
        {fields.map((field) => (
          <FormField
            key={field.name}
            {...field}
            value={formData[field.name]}
            onChange={onChange}
          />
        ))}

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