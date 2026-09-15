// src/components/common/PageHeader.jsx
import React from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';

const PageHeader = ({
  title,
  onAdd,
  addLabel = 'Add',
  isFormOpen = false,
}) => (
  <div className="page-header">
    <h1>{title}</h1>
    <button
      className={`btn-add ${isFormOpen ? 'btn-add--cancel' : ''}`}
      onClick={onAdd}
      aria-expanded={isFormOpen}
      aria-controls="crud-form"
    >
      {isFormOpen ? <FaTimes /> : <FaPlus />}
      {isFormOpen ? 'Cancel' : addLabel}
    </button>
  </div>
);

export default PageHeader;