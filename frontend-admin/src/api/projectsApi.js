// src/api/projectsApi.js
import api from './api';

export const projectsApi = {
  list: () =>
    api.get('/api/projects'),

  get: (id) =>
    api.get(`/api/projects/${id}`),

  create: (payload) =>
    api.post('/api/projects', payload),

  update: (id, payload) =>
    api.put(`/api/projects/${id}`, payload),

  remove: (id) =>
    api.delete(`/api/projects/${id}`),
};

export default projectsApi;