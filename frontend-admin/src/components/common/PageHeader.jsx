// src/components/common/PageHeader.jsx
import React from 'react';
import { FaPlus } from 'react-icons/fa';

const PageHeader = ({ title, onAdd, addLabel = 'Add' }) => (
  <div className="page-header">
    <h1>{title}</h1>
    <button className="btn-add" onClick={onAdd}>
      <FaPlus /> {addLabel}
    </button>
  </div>
);

export default PageHeader;