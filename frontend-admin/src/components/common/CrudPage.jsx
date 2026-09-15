// src/components/common/CrudPage.jsx
import React from 'react';
import PageHeader from './PageHeader';
import CrudForm from './CrudForm';
import CrudTable from './CrudTable';
import { useCrud } from '../../hooks/useCrud';

/**
 * @param {Object} props
 * @param {string} props.title             - Page title
 * @param {string} props.entityName        - e.g. "Product"
 * @param {string} props.entityNamePlural  - e.g. "products" (for delete confirm)
 * @param {Object} props.api               - { list, create, update, remove }
 * @param {Object} props.initialFormData
 * @param {Array}  props.fields            - Form config
 * @param {Array}  props.columns           - Table config
 */
const CrudPage = ({
  title,
  entityName,
  entityNamePlural,
  api,
  initialFormData,
  fields,
  columns,
}) => {
  const {
    items,
    loading,
    editing,
    formData,
    handleChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm,
  } = useCrud(api, initialFormData);

  return (
    <div className="content-page">
      <PageHeader
        title={title}
        onAdd={resetForm}
        addLabel={`Add ${entityName}`}
      />
      <CrudForm
        fields={fields}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isEditing={!!editing}
        entityName={entityName}
      />
      <CrudTable
        columns={columns}
        items={items}
        loading={loading}
        onEdit={handleEdit}
        onDelete={(id) => handleDelete(id, entityNamePlural)}
        colSpan={columns.length + 1}
      />
    </div>
  );
};

export default CrudPage;