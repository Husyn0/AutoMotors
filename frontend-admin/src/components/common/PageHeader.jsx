// src/components/common/PageHeader.jsx
import React from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import LocaleToggle from './LocaleToggle';

const PageHeader = ({
  title,
  onAdd,
  addLabel = 'Add',
  isFormOpen = false,
  // ── Table locale toggle (optional) ───────────────────────────
  showLocaleToggle = false,
  tableLocale = 'fr',
  onLocaleChange,
}) => (
  <div className="page-header">
    <h1>{title}</h1>

    <div className="page-header__actions">
      {showLocaleToggle && (
        <LocaleToggle locale={tableLocale} onChange={onLocaleChange} />
      )}

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
  </div>
);

export default PageHeader;