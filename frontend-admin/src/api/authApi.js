// src/api/authApi.js
import api from './api';

export const authApi = {
  login: (email, password) =>
    api.post('/api/auth/login', { email, password }),

  register: (payload) =>
    api.post('/api/auth/register', payload),

  me: () =>
    api.get('/api/auth/me'),

  refresh: () =>
    api.post('/api/auth/refresh'),

  logout: () =>
    api.post('/api/auth/logout'),
};

export default authApi;