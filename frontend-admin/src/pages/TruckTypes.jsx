// src/pages/TruckTypes.jsx
import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import truckTypesApi from '../api/truckTypesApi';

const TruckTypes = () => {
  const [truckTypes, setTruckTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', models: '', icon: '', description: '' });

  useEffect(() => {
    fetchTruckTypes();
  }, []);

  const fetchTruckTypes = async () => {
    try {
      const response = await truckTypesApi.list();
      setTruckTypes(response.data);
    } catch (error) {
      console.error('Error fetching truck types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await truckTypesApi.update(editing.id, formData);
      } else {
        await truckTypesApi.create(formData);
      }
      setFormData({ name: '', models: '', icon: '', description: '' });
      setEditing(null);
      fetchTruckTypes();
    } catch (error) {
      console.error('Error saving truck type:', error);
    }
  };

  const handleEdit = (type) => {
    setEditing(type);
    setFormData({
      name: type.name,
      models: type.models,
      icon: type.icon || '',
      description: type.description,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this truck type?')) {
      try {
        await truckTypesApi.remove(id);
        fetchTruckTypes();
      } catch (error) {
        console.error('Error deleting truck type:', error);
      }
    }
  };

  return (
    <div className="content-page">
      <div className="page-header">
        <h1>Truck Types Management</h1>
        <button className="btn-add" onClick={() => {
          setEditing(null);
          setFormData({ name: '', models: '', icon: '', description: '' });
        }}>
          <FaPlus /> Add Truck Type
        </button>
      </div>

      <form className="content-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <input
            type="text"
            placeholder="Truck Type Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Models (comma separated)"
            value={formData.models}
            onChange={(e) => setFormData({ ...formData, models: e.target.value })}
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
            {editing ? 'Update' : 'Create'} Truck Type
          </button>
        </div>
      </form>

      <div className="table-container">
        <table className="content-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Icon</th>
              <th>Name</th>
              <th>Models</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6">Loading...</td></tr>
            ) : truckTypes.length === 0 ? (
              <tr><td colSpan="6">No truck types found</td></tr>
            ) : (
              truckTypes.map((type) => (
                <tr key={type.id}>
                  <td>{type.id}</td>
                  <td className="icon-cell">{type.icon || '🚛'}</td>
                  <td>{type.name}</td>
                  <td>{type.models}</td>
                  <td className="description-cell">{type.description}</td>
                  <td className="actions-cell">
                    <button className="btn-edit" onClick={() => handleEdit(type)}>
                      <FaEdit />
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(type.id)}>
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

export default TruckTypes;