// src/api/truckTypesApi.js
import api from './api';

export const truckTypesApi = {
  list: () =>
    api.get('/api/truck-types'),

  get: (id) =>
    api.get(`/api/truck-types/${id}`),

  create: (payload) =>
    api.post('/api/truck-types', payload),

  update: (id, payload) =>
    api.put(`/api/truck-types/${id}`, payload),

  remove: (id) =>
    api.delete(`/api/truck-types/${id}`),
};

export default truckTypesApi;