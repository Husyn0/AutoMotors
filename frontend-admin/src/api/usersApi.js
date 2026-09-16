// src/api/usersApi.js
import api from './api';

/**
 * User management API.
 *
 * NOTE: The backend only exposes auth endpoints — there is no
 * `GET /api/users`, `PUT /api/users/{id}`, or `DELETE /api/users/{id}`.
 * So this module intentionally only supports:
 *   - register (create)
 *   - me      (read current user)
 */
export const usersApi = {
  /**
   * Create a new admin user.
   * @param {{name:string,email:string,password:string,password_confirmation:string}} payload
   */
  register: (payload) => api.post('/api/auth/register', payload),

  /**
   * Get the currently authenticated user.
   */
  me: () => api.get('/api/auth/me'),
};

export default usersApi;