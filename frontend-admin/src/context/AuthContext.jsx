// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import authApi from '../api/authApi';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await authApi.me();
      setUser(response.data);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password);
      const { token } = response.data;
      localStorage.setItem('token', token);
      setToken(token);

      // Fetch user explicitly (backend may not return user in login response)
      const me = await authApi.me();
      setUser(me.data);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.message || 'Login failed',
      };
    }
  };

  const logout = async () => {
    try {
      if (localStorage.getItem('token')) {
        await authApi.logout();
      }
    } catch (_) {
      // ignore logout errors
    }
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = { user, login, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};