// src/pages/Products.jsx
import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import productsApi from '../api/productsApi';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    short_description: '',
    image: '',
  });

  const categories = ['batteries', 'lubricants', 'tires', 'spareParts'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsApi.list();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await productsApi.update(editing.id, formData);
      } else {
        await productsApi.create(formData);
      }
      setFormData({ name: '', category: '', price: '', short_description: '', image: '' });
      setEditing(null);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product) => {
    setEditing(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      short_description: product.short_description,
      image: product.image || '',
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsApi.remove(id);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <div className="content-page">
      <div className="page-header">
        <h1>Products Management</h1>
        <button className="btn-add" onClick={() => {
          setEditing(null);
          setFormData({ name: '', category: '', price: '', short_description: '', image: '' });
        }}>
          <FaPlus /> Add Product
        </button>
      </div>

      <form className="content-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <input
            type="text"
            placeholder="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          />
          <textarea
            placeholder="Short Description"
            value={formData.short_description}
            onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
            required
            className="full-width"
          />
          <button type="submit" className="btn-submit">
            {editing ? 'Update' : 'Create'} Product
          </button>
        </div>
      </form>

      <div className="table-container">
        <table className="content-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6">Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan="6">No products found</td></tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td><span className={`category-badge ${product.category}`}>{product.category}</span></td>
                  <td>€{product.price}</td>
                  <td className="description-cell">{product.short_description}</td>
                  <td className="actions-cell">
                    <button className="btn-edit" onClick={() => handleEdit(product)}>
                      <FaEdit />
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(product.id)}>
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

export default Products;