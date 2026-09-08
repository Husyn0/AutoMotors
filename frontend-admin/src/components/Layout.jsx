// src/components/Layout.jsx
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaBox, 
  FaCog, 
  FaTruck, 
  FaProjectDiagram,
  FaSignOutAlt,
  FaBars
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FaHome /> },
    { path: '/products', label: 'Products', icon: <FaBox /> },
    { path: '/services', label: 'Services', icon: <FaCog /> },
    { path: '/truck-types', label: 'Truck Types', icon: <FaTruck /> },
    { path: '/projects', label: 'Projects', icon: <FaProjectDiagram /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <FaBars />
      </button>

      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-brand">
          <h2>AUTOMOTORS</h2>
          <p>Admin Panel</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink 
              key={item.path} 
              to={item.path}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      <main className={`admin-content ${sidebarOpen ? 'open' : 'closed'}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;