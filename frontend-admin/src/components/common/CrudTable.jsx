// src/components/common/CrudTable.jsx
import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

/**
 * @param {Object} props
 * @param {Array} props.columns - [{ key, label, render?, className? }]
 * @param {Array} props.items
 * @param {boolean} props.loading
 * @param {(item) => void} props.onEdit
 * @param {(id) => void} props.onDelete
 * @param {number} props.colSpan - total columns + 1 (for actions)
 */
const CrudTable = ({ columns, items, loading, onEdit, onDelete, colSpan }) => {
  return (
    <div className="table-container">
      <table className="content-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={colSpan}>Loading...</td></tr>
          ) : items.length === 0 ? (
            <tr><td colSpan={colSpan}>No items found</td></tr>
          ) : (
            items.map((item) => (
              <tr key={item.id}>
                {columns.map((col) => (
                  <td key={col.key} className={col.className || ''}>
                    {col.render ? col.render(item) : item[col.key]}
                  </td>
                ))}
                <td className="actions-cell">
                  <button className="btn-edit" onClick={() => onEdit(item)}>
                    <FaEdit />
                  </button>
                  <button className="btn-delete" onClick={() => onDelete(item.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CrudTable;