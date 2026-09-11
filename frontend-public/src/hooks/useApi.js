// src/hooks/useApi.js
import { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../App';

/**
 * Generic data-fetching hook that re-fetches when language changes.
 * @param {Function} fetcher - (lang) => Promise<data>
 * @param {Array} deps - extra dependencies
 * @param {*} fallback - static fallback data (used if API fails)
 */
export const useApi = (fetcher, deps = [], fallback = null) => {
  const { language } = useContext(LanguageContext);
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetcher(language)
      .then((result) => {
        if (cancelled) return;
        // Handle common Laravel response shapes
        const payload = result?.data ?? result;
        setData(payload);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || 'Error');
        // Keep fallback if provided
        if (fallback) setData(fallback);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, ...deps]);

  return { data, loading, error };
};