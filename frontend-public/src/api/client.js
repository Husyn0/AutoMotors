// src/api/client.js
import axios from 'axios';

// Base URL - adjust via .env if needed
const API_BASE_URL = process.env.REACT_APP_API_URL ;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - inject language on every request
apiClient.interceptors.request.use(
  (config) => {
    const lang = localStorage.getItem('lang') || 'fr';
    config.headers['Accept-Language'] = lang;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - unwrap data or normalize errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    console.error('[API Error]', message);
    return Promise.reject({ message, status: error.response?.status });
  }
);

export default apiClient;