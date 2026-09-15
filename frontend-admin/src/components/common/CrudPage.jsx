// src/components/common/CrudPage.jsx
import React from 'react';
import PageHeader from './PageHeader';
import CrudForm from './CrudForm';
import CrudTable from './CrudTable';
import { useCrud } from '../../hooks/useCrud';

const CrudPage = ({
  title,
  entityName,
  entityNamePlural,
  api,
  initialFormData,
  fields,
  columns,
  initialPageSize = 10,
}) => {
  const {
    pagedItems,
    loading,
    editing,
    formData,
    handleChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm,
    // pagination
    page,
    pageSize,
    totalItems,
    totalPages,
    setPage,
    handlePageSizeChange,
  } = useCrud(api, initialFormData, { initialPageSize });

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
        items={pagedItems}
        loading={loading}
        onEdit={handleEdit}
        onDelete={(id) => handleDelete(id, entityNamePlural)}
        colSpan={columns.length + 1}
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        totalPages={totalPages}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default CrudPage;