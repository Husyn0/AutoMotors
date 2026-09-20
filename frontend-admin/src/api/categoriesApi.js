// src/api/categoriesApi.js
import api from './api';

export const categoriesApi = {
  list: () =>
    api.get('/api/categories'),

  get: (id) =>
    api.get(`/api/categories/${id}`),

  create: (payload) =>
    api.post('/api/categories', payload),

  update: (id, payload) =>
    api.put(`/api/categories/${id}`, payload),

  remove: (id) =>
    api.delete(`/api/categories/${id}`),
};

export default categoriesApi;