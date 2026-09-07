// src/pages/ServicesManager.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

function ServicesManager() {
  const [services, setServices] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_URL}/services`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`${API_URL}/services/${editing}`, form, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_URL}/services`, form, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      setForm({ name: '', description: '' });
      setEditing(null);
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce service ?')) {
      try {
        await axios.delete(`${API_URL}/services/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const handleEdit = (service) => {
    setEditing(service.id);
    setForm({ name: service.name, description: service.description || '' });
  };

  return (
    <div className="manager">
      <h1>Gestion des Services</h1>
      <form onSubmit={handleSubmit} className="form-inline">
        <input
          type="text"
          placeholder="Nom du service"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button type="submit">{editing ? 'Mettre à jour' : 'Ajouter'}</button>
        {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '', description: '' }); }}>Annuler</button>}
      </form>
      <div className="list">
        {services.map(service => (
          <div key={service.id} className="list-item">
            <div>
              <strong>{service.name}</strong>
              <p>{service.description}</p>
            </div>
            <div className="actions">
              <button onClick={() => handleEdit(service)}>✏️</button>
              <button onClick={() => handleDelete(service.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServicesManager;