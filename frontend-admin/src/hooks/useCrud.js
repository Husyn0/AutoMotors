// src/hooks/useCrud.js
import { useState, useEffect, useCallback, useMemo } from 'react';

const DEFAULT_PAGE_SIZE = 10;

export const useCrud = (api, initialFormData, options = {}) => {
  const { initialPageSize = DEFAULT_PAGE_SIZE } = options;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState(null);

  // ── Form visibility ────────────────────────────────────────────
  const [isFormOpen, setIsFormOpen] = useState(false);

  // ── Pagination state ───────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.list();
      setItems(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setEditing(null);
  }, [initialFormData]);

  const openFormForCreate = useCallback(() => {
    resetForm();
    setIsFormOpen(true);
  }, [resetForm]);

  const closeForm = useCallback(() => {
    resetForm();
    setIsFormOpen(false);
  }, [resetForm]);

  const toggleForm = useCallback(() => {
    if (isFormOpen) {
      closeForm();
    } else {
      openFormForCreate();
    }
  }, [isFormOpen, closeForm, openFormForCreate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.update(editing.id, formData);
      } else {
        await api.create(formData);
      }
      closeForm();
      fetchItems();
    } catch (err) {
      console.error('Error saving item:', err);
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    const next = { ...initialFormData };
    Object.keys(initialFormData).forEach((key) => {
      next[key] = item[key] ?? initialFormData[key];
    });
    setFormData(next);
    setIsFormOpen(true);
  };

  const handleDelete = async (id, itemLabel = 'item') => {
    if (!window.confirm(`Are you sure you want to delete this ${itemLabel}?`)) return;
    try {
      await api.remove(id);
      fetchItems();
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // ── Derived pagination values ──────────────────────────────────
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pagedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setPage(1);
  };

  return {
    // data
    items,
    pagedItems,
    loading,
    error,
    editing,
    formData,

    // form
    isFormOpen,
    setFormData,
    handleChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm,
    openFormForCreate,
    closeForm,
    toggleForm,

    // pagination
    page,
    pageSize,
    totalItems,
    totalPages,
    setPage,
    handlePageSizeChange,
  };
};