// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

function Dashboard() {
  const [stats, setStats] = useState({});
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/company`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = response.data;
      setStats({
        services: data.services?.length || 0,
        products: data.products?.length || 0,
        faqs: data.faqs?.length || 0,
        images: data.gallery_images?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="dashboard">
      <h1>Tableau de bord</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.services || 0}</h3>
          <p>Services</p>
        </div>
        <div className="stat-card">
          <h3>{stats.products || 0}</h3>
          <p>Produits</p>
        </div>
        <div className="stat-card">
          <h3>{stats.faqs || 0}</h3>
          <p>FAQ</p>
        </div>
        <div className="stat-card">
          <h3>{stats.images || 0}</h3>
          <p>Images</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;