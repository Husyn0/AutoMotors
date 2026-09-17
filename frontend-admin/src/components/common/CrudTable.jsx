// src/components/common/CrudTable.jsx
import React from 'react';
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
} from 'react-icons/fa';
import Pagination from './Pagination';

const SortIcon = ({ active, direction }) => {
  if (!active || !direction) return <FaSort className="sort-icon" />;
  return direction === 'asc' ? (
    <FaSortUp className="sort-icon sort-icon--active" />
  ) : (
    <FaSortDown className="sort-icon sort-icon--active" />
  );
};

const CrudTable = ({
  columns,
  items,
  loading,
  onEdit,
  onDelete,
  colSpan,

  // search
  searchable = false,
  search = '',
  onSearch,

  // sort
  sortable = false,
  sort = { key: null, direction: null },
  onSort,

  // pagination
  page,
  pageSize,
  totalItems,
  totalPages,
  onPageChange,
  onPageSizeChange,
}) => {
  return (
    <div className="table-container">
      {searchable && (
        <div className="table-toolbar">
          <div className="table-search">
            <FaSearch className="table-search__icon" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearch?.(e.target.value)}
              placeholder="Search…"
              aria-label="Search table"
            />
          </div>
        </div>
      )}

      <table className="content-table">
        <thead>
          <tr>
            {columns.map((col) => {
              const isSortable = sortable && col.sortable !== false;
              const isActive = sort?.key === col.key;
              return (
                <th
                  key={col.key}
                  className={isSortable ? 'th-sortable' : ''}
                  onClick={isSortable ? () => onSort?.(col.key) : undefined}
                  aria-sort={
                    isActive
                      ? sort.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                >
                  <span className="th-content">
                    {col.label}
                    {isSortable && (
                      <SortIcon active={isActive} direction={sort?.direction} />
                    )}
                  </span>
                </th>
              );
            })}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={colSpan}>Loading...</td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={colSpan}>No items found</td>
            </tr>
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

      {!loading && (
        <Pagination
          page={page}
          pageSize={pageSize}
          totalItems={totalItems}
          totalPages={totalPages}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
};

export default CrudTable;