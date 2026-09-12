// src/api/servicesApi.js
import api from './api';

export const servicesApi = {
  list: () =>
    api.get('/api/services'),

  get: (id) =>
    api.get(`/api/services/${id}`),

  create: (payload) =>
    api.post('/api/services', payload),

  update: (id, payload) =>
    api.put(`/api/services/${id}`, payload),

  remove: (id) =>
    api.delete(`/api/services/${id}`),
};

export default servicesApi;