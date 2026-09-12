// src/api/productsApi.js
import api from './api';

export const productsApi = {
  list: () =>
    api.get('/api/products'),

  get: (id) =>
    api.get(`/api/products/${id}`),

  create: (payload) =>
    api.post('/api/products', payload),

  update: (id, payload) =>
    api.put(`/api/products/${id}`, payload),

  remove: (id) =>
    api.delete(`/api/products/${id}`),
};

export default productsApi;