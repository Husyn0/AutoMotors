// src/hooks/useCrud.js
import { useState, useEffect, useCallback, useMemo } from 'react';

const DEFAULT_PAGE_SIZE = 10;

/**
 * Fields that should NOT be duplicated into translations.
 * These are language-agnostic (images, prices, categories, icons...).
 */
const NON_TRANSLATABLE_FIELDS = new Set(['price', 'category', 'image', 'icon']);

export const useCrud = (api, initialFormData, options = {}) => {
  const { initialPageSize = DEFAULT_PAGE_SIZE } = options;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState(null);

  // ── Form visibility ────────────────────────────────────────────
  const [isFormOpen, setIsFormOpen] = useState(false);

  // ── Translation state ──────────────────────────────────────────
  const [activeLocale, setActiveLocale] = useState('fr');

  // ── Search + sort state ────────────────────────────────────────
  const [search, setSearch] = useState('');
  // sort = { key: string|null, direction: 'asc'|'desc'|null }
  const [sort, setSort] = useState({ key: null, direction: null });

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
    setActiveLocale('fr');
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

  /**
   * Build the payload sent to the API.
   * - Base fields (FR) are sent at the root.
   * - Translatable fields for other locales go inside `translations`.
   */
  const buildPayload = useCallback(() => {
    const base = {};
    const translations = {};

    Object.keys(formData).forEach((key) => {
      // Skip the internal `translations` container
      if (key === 'translations') return;

      const value = formData[key];

      // Locale-scoped keys look like `en.name`, `en.description`
      const localeMatch = key.match(/^([a-z]{2})\.(.+)$/);
      if (localeMatch) {
        const [, locale, field] = localeMatch;
        if (!translations[locale]) translations[locale] = {};
        // Only keep non-empty values
        if (value !== '' && value !== null && value !== undefined) {
          translations[locale][field] = value;
        }
        return;
      }

      base[key] = value;
    });

    // Attach translations only if at least one locale has values
    const hasTranslations = Object.values(translations).some(
      (localeObj) => Object.keys(localeObj).length > 0
    );

    return hasTranslations ? { ...base, translations } : base;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = buildPayload();
      if (editing) {
        await api.update(editing.id, payload);
      } else {
        await api.create(payload);
      }
      closeForm();
      fetchItems();
    } catch (err) {
      console.error('Error saving item:', err);
    }
  };

  const handleEdit = (item) => {
    setEditing(item);

    // Start from the initial shape so we always have the right keys
    const next = { ...initialFormData };

    // Hydrate base (FR) fields
    Object.keys(initialFormData).forEach((key) => {
      if (key === 'translations') return;
      next[key] = item[key] ?? initialFormData[key];
    });

    // Hydrate EN translations if present
    const itemTranslations = item.translations || {};
    Object.entries(itemTranslations).forEach(([locale, fields]) => {
      if (locale === 'fr') return; // FR is stored as base fields
      Object.entries(fields).forEach(([field, value]) => {
        next[`${locale}.${field}`] = value ?? '';
      });
    });

    setFormData(next);
    setActiveLocale('fr');
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

  /**
   * Unified change handler.
   * Accepts either:
   *   handleChange('name', value)          → base (FR) field
   *   handleChange('en.name', value)       → translated field
   */
  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // ── Search handler ─────────────────────────────────────────────
  const handleSearch = useCallback((value) => {
    setSearch(value);
    setPage(1); // reset to first page on new search
  }, []);

  // ── Sort handler: cycles asc → desc → none ─────────────────────
  const handleSort = useCallback((key) => {
    setSort((prev) => {
      if (prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      return { key: null, direction: null }; // third click clears
    });
    setPage(1);
  }, []);

  // ── Derived: filtered by search ────────────────────────────────
  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      Object.values(item).some((val) => {
        if (val === null || val === undefined) return false;
        if (typeof val === 'object') return false; // skip translations blobs
        return String(val).toLowerCase().includes(q);
      })
    );
  }, [items, search]);

  // ── Derived: sorted ────────────────────────────────────────────
  const sortedItems = useMemo(() => {
    if (!sort.key || !sort.direction) return filteredItems;
    const dir = sort.direction === 'asc' ? 1 : -1;
    return [...filteredItems].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === 'number' && typeof bv === 'number') {
        return (av - bv) * dir;
      }
      return String(av).localeCompare(String(bv), undefined, {
        numeric: true,
        sensitivity: 'base',
      }) * dir;
    });
  }, [filteredItems, sort]);

  // ── Derived pagination values ──────────────────────────────────
  const totalItems = sortedItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pagedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedItems.slice(start, start + pageSize);
  }, [sortedItems, page, pageSize]);

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

    // translations
    activeLocale,
    setActiveLocale,
    isTranslatable: (fieldName) => !NON_TRANSLATABLE_FIELDS.has(fieldName),

    // search + sort
    search,
    handleSearch,
    sort,
    handleSort,

    // pagination
    page,
    pageSize,
    totalItems,
    totalPages,
    setPage,
    handlePageSizeChange,
  };
};