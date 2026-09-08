// frontend-admin/src/pages/Projects.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/content/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`/api/content/projects/${editing.id}`, formData);
      } else {
        await axios.post('/api/content/projects', formData);
      }
      setFormData({ title: '', description: '', image: '' });
      setEditing(null);
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleEdit = (project) => {
    setEditing(project);
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image || ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`/api/content/projects/${id}`);
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  return (
    <div className="content-page">
      <div className="page-header">
        <h1>Projects Management</h1>
        <button className="btn-add" onClick={() => {
          setEditing(null);
          setFormData({ title: '', description: '', image: '' });
        }}>
          <FaPlus /> Add Project
        </button>
      </div>

      <form className="content-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <input
            type="text"
            placeholder="Project Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Image URL or Emoji"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            className="full-width"
          />
          <button type="submit" className="btn-submit">
            {editing ? 'Update' : 'Create'} Project
          </button>
        </div>
      </form>

      <div className="table-container">
        <table className="content-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5">Loading...</td></tr>
            ) : projects.length === 0 ? (
              <tr><td colSpan="5">No projects found</td></tr>
            ) : (
              projects.map(project => (
                <tr key={project.id}>
                  <td>{project.id}</td>
                  <td className="icon-cell">{project.image || '📁'}</td>
                  <td>{project.title}</td>
                  <td className="description-cell">{project.description}</td>
                  <td className="actions-cell">
                    <button className="btn-edit" onClick={() => handleEdit(project)}>
                      <FaEdit />
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(project.id)}>
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

export default Projects;