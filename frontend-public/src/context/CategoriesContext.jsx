import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCategories } from '../api/endpoints';
import { useLanguage } from './LanguageContext';

const CategoriesContext = createContext(null);

export const CategoriesProvider = ({ children }) => {
  const { language } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getCategories()
      .then((res) => {
        const list = res?.data ?? res ?? [];
        setCategories(
          (Array.isArray(list) ? list : []).map((c) => ({
            id: c.id,
            slug: c.slug,
            name: c.name,
            icon: c.icon || '📦',
            image: c.image_url || c.image || null,
          }))
        );
      })
      .catch((err) => setError(err.message || 'Failed to load categories'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [language, load]);

  return (
    <CategoriesContext.Provider value={{ categories, loading, error, reload: load }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => {
  const ctx = useContext(CategoriesContext);
  if (!ctx) throw new Error('useCategories must be used inside CategoriesProvider');
  return ctx;
};