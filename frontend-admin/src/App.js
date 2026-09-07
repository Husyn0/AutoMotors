// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CompanyEdit from './pages/CompanyEdit';
import ServicesManager from './pages/ServicesManager';
import ProductsManager from './pages/ProductsManager';
import FaqManager from './pages/FaqManager';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${API_URL}/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        logout();
      }
    } catch {
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setUser(null);
  };

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <BrowserRouter>
      <div className="admin-app">
        <nav className="admin-nav">
          <div className="nav-brand">AUTO MOTORS Admin</div>
          <div className="nav-links">
            <a href="/admin">Dashboard</a>
            <a href="/admin/company">Entreprise</a>
            <a href="/admin/services">Services</a>
            <a href="/admin/products">Produits</a>
            <a href="/admin/faqs">FAQ</a>
          </div>
          <div className="nav-user">
            <span>{user?.name}</span>
            <button onClick={logout}>Déconnexion</button>
          </div>
        </nav>
        <div className="admin-content">
          <Routes>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/company" element={<CompanyEdit />} />
            <Route path="/admin/services" element={<ServicesManager />} />
            <Route path="/admin/products" element={<ProductsManager />} />
            <Route path="/admin/faqs" element={<FaqManager />} />
            <Route path="*" element={<Navigate to="/admin" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;