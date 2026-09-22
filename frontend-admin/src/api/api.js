// src/api/api.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

// Read the admin's chosen locale (persisted across reloads)
export const getLocale = () => localStorage.getItem('admin_locale') || 'fr';
export const setLocale = (locale) => {
  localStorage.setItem('admin_locale', locale);
  window.dispatchEvent(new CustomEvent('admin-locale-change', { detail: locale }));
};

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // ★ Send locale on every request
    config.headers['Accept-Language'] = getLocale();
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const path = window.location.pathname;
      if (path !== '/login') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;