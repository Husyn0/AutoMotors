// src/components/common/CrudPage.jsx
import React, { useEffect, useRef } from 'react';
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
    isFormOpen,
    handleChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    closeForm,
    toggleForm,
    // pagination
    page,
    pageSize,
    totalItems,
    totalPages,
    setPage,
    handlePageSizeChange,
  } = useCrud(api, initialFormData, { initialPageSize });

  // Scroll the form into view when it opens via Edit
  const formWrapperRef = useRef(null);
  useEffect(() => {
    if (isFormOpen && editing) {
      formWrapperRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [isFormOpen, editing]);

  return (
    <div className="content-page">
      <PageHeader
        title={title}
        onAdd={toggleForm}
        addLabel={`Add ${entityName}`}
        isFormOpen={isFormOpen}
      />

      <div
        ref={formWrapperRef}
        className={`crud-form-wrapper ${isFormOpen ? 'open' : 'closed'}`}
      >
        {isFormOpen && (
          <CrudForm
            fields={fields}
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            isEditing={!!editing}
            entityName={entityName}
          />
        )}
      </div>

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