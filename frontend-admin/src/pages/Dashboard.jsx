// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaCog, FaTruck, FaProjectDiagram, FaUsers, FaUserPlus } from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import productsApi from '../api/productsApi';
import servicesApi from '../api/servicesApi';
import truckTypesApi from '../api/truckTypesApi';
import projectsApi from '../api/projectsApi';

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    services: 0,
    truckTypes: 0,
    projects: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [products, services, truckTypes, projects] = await Promise.all([
        productsApi.list(),
        servicesApi.list(),
        truckTypesApi.list(),
        projectsApi.list(),
      ]);

      setStats({
        products: products.data.length,
        services: services.data.length,
        truckTypes: truckTypes.data.length,
        projects: projects.data.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Products', value: stats.products, icon: <FaBox />, color: '#4CAF50' },
    { title: 'Services', value: stats.services, icon: <FaCog />, color: '#2196F3' },
    { title: 'Truck Types', value: stats.truckTypes, icon: <FaTruck />, color: '#FF9800' },
    { title: 'Projects', value: stats.projects, icon: <FaProjectDiagram />, color: '#9C27B0' },
    { title: 'Admins',      value: 1,                icon: <FaUsers />,         color: '#E91E63' },
  ];

  const chartData = [
    { name: 'Products', value: stats.products },
    { name: 'Services', value: stats.services },
    { name: 'Truck Types', value: stats.truckTypes },
    { name: 'Projects', value: stats.projects },
    { name: 'Admins',      value: 1 },
  ];

  const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#E91E63'];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to the AUTOMOTORS admin panel</p>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderColor: stat.color }}>
            <div className="stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Content Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Content Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#2196F3">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* ── Admin quick actions ─────────────────────────────── */}
      <div className="dashboard-quick-actions">
        <div className="chart-card">
          <h3>Administrators</h3>
          <p className="muted">
            The backend exposes a single admin account. You can register additional
            administrators below.
          </p>
          <Link to="/users" className="btn-primary">
            <FaUserPlus /> Manage Admins
          </Link>
        </div>

        <div className="chart-card">
          <h3>Quick Links</h3>
          <div className="quick-links">
            <Link to="/products"    className="quick-link">📦 Products</Link>
            <Link to="/services"    className="quick-link">🔧 Services</Link>
            <Link to="/truck-types" className="quick-link">🚛 Truck Types</Link>
            <Link to="/projects"    className="quick-link">📁 Projects</Link>
            <Link to="/settings"    className="quick-link">⚙️ Settings</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;