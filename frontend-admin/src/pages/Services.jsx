// src/pages/Services.jsx
import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import servicesApi from '../api/servicesApi';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', icon: '' });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await servicesApi.list();
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await servicesApi.update(editing.id, formData);
      } else {
        await servicesApi.create(formData);
      }
      setFormData({ title: '', description: '', icon: '' });
      setEditing(null);
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleEdit = (service) => {
    setEditing(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon || '',
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await servicesApi.remove(id);
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  return (
    <div className="content-page">
      <div className="page-header">
        <h1>Services Management</h1>
        <button className="btn-add" onClick={() => {
          setEditing(null);
          setFormData({ title: '', description: '', icon: '' });
        }}>
          <FaPlus /> Add Service
        </button>
      </div>

      <form className="content-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <input
            type="text"
            placeholder="Service Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Icon (emoji)"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            className="full-width"
          />
          <button type="submit" className="btn-submit">
            {editing ? 'Update' : 'Create'} Service
          </button>
        </div>
      </form>

      <div className="table-container">
        <table className="content-table">
          <thead>
            <tr>
              <th>Icon</th>
              <th>Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5">Loading...</td></tr>
            ) : services.length === 0 ? (
              <tr><td colSpan="5">No services found</td></tr>
            ) : (
              services.map((service) => (
                <tr key={service.id}>
                  <td className="icon-cell">{service.icon || '📋'}</td>
                  <td>{service.title}</td>
                  <td className="description-cell">{service.description}</td>
                  <td className="actions-cell">
                    <button className="btn-edit" onClick={() => handleEdit(service)}>
                      <FaEdit />
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(service.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Services;