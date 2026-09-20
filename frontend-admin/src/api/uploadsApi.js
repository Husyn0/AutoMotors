// src/api/uploadsApi.js
import api from './api';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

export const uploadsApi = {
  /**
   * Upload a file to a whitelisted folder.
   * @param {'products'|'categories'|'services'|'truck-types'|'projects'|'settings'} folder
   * @param {File} file
   * @param {(percent:number)=>void} [onProgress]
   * @returns {Promise<{path:string, url:string, name:string}>}
   */
  upload: (folder, file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    return api
      .post(`/api/uploads/${folder}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (!onProgress || !e.total) return;
          onProgress(Math.round((e.loaded * 100) / e.total));
        },
      })
      .then((res) => res.data);
  },

  /**
   * Delete an uploaded file.
   * @param {string} folder
   * @param {string} filename — just the basename, not the full path
   */
  remove: (folder, filename) =>
    api.delete(`/api/uploads/${folder}/${filename}`),

  /**
   * Build a public URL for an image path returned by the API.
   * Handles three cases:
   *  - already absolute (http...)          → return as-is
   *  - legacy path ("/images/foo.jpg")     → return as-is
   *  - storage path ("products/foo.png")   → `${BASE_URL}/storage/${path}`
   */
  resolveUrl: (path) => {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path;
    if (path.startsWith('/')) return `${BASE_URL}${path}`;
    return `${BASE_URL}/storage/${path}`;
  },
};

export default uploadsApi;