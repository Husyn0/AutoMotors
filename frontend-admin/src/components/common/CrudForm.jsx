// src/components/common/CrudForm.jsx
import React from 'react';
import FormField from './FormField';

/**
 * @param {Object} props
 * @param {Array} props.fields - see FormField props
 * @param {Object} props.formData
 * @param {(name: string, value: any) => void} props.onChange
 * @param {(e: Event) => void} props.onSubmit
 * @param {boolean} props.isEditing
 * @param {string} props.entityName - e.g. "Product"
 */
const CrudForm = ({ fields, formData, onChange, onSubmit, isEditing, entityName }) => {
  return (
    <form className="content-form" onSubmit={onSubmit}>
      <div className="form-grid">
        {fields.map((field) => (
          <FormField
            key={field.name}
            {...field}
            value={formData[field.name]}
            onChange={onChange}
          />
        ))}
        <button type="submit" className="btn-submit">
          {isEditing ? 'Update' : 'Create'} {entityName}
        </button>
      </div>
    </form>
  );
};

export default CrudForm;