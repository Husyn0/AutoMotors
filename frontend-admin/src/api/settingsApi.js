// src/api/settingsApi.js
import api from './api';

export const settingsApi = {
  get: () =>
    api.get('/api/settings'),

  update: (payload) =>
    api.put('/api/settings', payload),
};

export default settingsApi;