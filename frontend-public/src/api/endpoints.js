// src/api/endpoints.js
import apiClient from './client';

// ---------- PRODUCTS ----------
export const getProducts = (lang) =>
  apiClient.get('/products', { params: lang ? { lang } : {} });

export const getProduct = (id, lang) =>
  apiClient.get(`/products/${id}`, { params: lang ? { lang } : {} });

// ---------- SERVICES ----------
export const getServices = (lang) =>
  apiClient.get('/services', { params: lang ? { lang } : {} });

export const getService = (id, lang) =>
  apiClient.get(`/services/${id}`, { params: lang ? { lang } : {} });

// ---------- TRUCK TYPES ----------
export const getTruckTypes = (lang) =>
  apiClient.get('/truck-types', { params: lang ? { lang } : {} });

export const getTruckType = (id, lang) =>
  apiClient.get(`/truck-types/${id}`, { params: lang ? { lang } : {} });

// ---------- PROJECTS ----------
export const getProjects = (lang) =>
  apiClient.get('/projects', { params: lang ? { lang } : {} });

export const getProject = (id, lang) =>
  apiClient.get(`/projects/${id}`, { params: lang ? { lang } : {} });

// ---------- SETTINGS ----------
export const getSettings = (lang) =>
  apiClient.get('/settings', { params: lang ? { lang } : {} });