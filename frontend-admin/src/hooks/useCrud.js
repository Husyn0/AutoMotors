// src/hooks/useCrud.js
import { useState, useEffect, useCallback } from 'react';

/**
 * Generic CRUD hook.
 * @param {Object} api - Object with { list, create, update, remove }
 * @param {Object} initialFormData - Empty form shape, e.g. { name: '', price: '' }
 */
export const useCrud = (api, initialFormData) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.update(editing.id, formData);
      } else {
        await api.create(formData);
      }
      resetForm();
      fetchItems();
    } catch (err) {
      console.error('Error saving item:', err);
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    // Only pick fields that exist in initialFormData
    const next = { ...initialFormData };
    Object.keys(initialFormData).forEach((key) => {
      next[key] = item[key] ?? initialFormData[key];
    });
    setFormData(next);
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

  return {
    items,
    loading,
    editing,
    formData,
    error,
    setFormData,
    handleChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm,
  };
};