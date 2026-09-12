// src/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import { FaSave } from 'react-icons/fa';
import settingsApi from '../api/settingsApi';

const Settings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsApi.get();
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await settingsApi.update(settings);
      setMessage('Settings saved successfully!');
    } catch (error) {
      setMessage('Error saving settings');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <button className="btn-save" onClick={handleSave} disabled={saving}>
          <FaSave /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
          {message}
        </div>
      )}

      {loading ? (
        <div>Loading settings...</div>
      ) : (
        <div className="settings-grid">
          <div className="settings-card">
            <h3>Company Information</h3>
            <div className="setting-group">
              <label>Company Name</label>
              <input
                type="text"
                value={settings.company_name || ''}
                onChange={(e) => handleChange('company_name', e.target.value)}
              />
            </div>
            <div className="setting-group">
              <label>Company Slogan</label>
              <input
                type="text"
                value={settings.company_slogan || ''}
                onChange={(e) => handleChange('company_slogan', e.target.value)}
              />
            </div>
            <div className="setting-group">
              <label>Email Address</label>
              <input
                type="email"
                value={settings.email_address || ''}
                onChange={(e) => handleChange('email_address', e.target.value)}
              />
            </div>
          </div>

          <div className="settings-card">
            <h3>Contact Information</h3>
            <div className="setting-group">
              <label>Phone Numbers (comma separated)</label>
              <input
                type="text"
                value={settings.phone_numbers || ''}
                onChange={(e) => handleChange('phone_numbers', e.target.value)}
              />
            </div>
            <div className="setting-group">
              <label>Main Address</label>
              <textarea
                value={settings.main_address || ''}
                onChange={(e) => handleChange('main_address', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="settings-card">
            <h3>Social Media</h3>
            <div className="setting-group">
              <label>Facebook</label>
              <input
                type="url"
                value={settings.facebook_url || ''}
                onChange={(e) => handleChange('facebook_url', e.target.value)}
              />
            </div>
            <div className="setting-group">
              <label>Twitter</label>
              <input
                type="url"
                value={settings.twitter_url || ''}
                onChange={(e) => handleChange('twitter_url', e.target.value)}
              />
            </div>
            <div className="setting-group">
              <label>Instagram</label>
              <input
                type="url"
                value={settings.instagram_url || ''}
                onChange={(e) => handleChange('instagram_url', e.target.value)}
              />
            </div>
            <div className="setting-group">
              <label>LinkedIn</label>
              <input
                type="url"
                value={settings.linkedin_url || ''}
                onChange={(e) => handleChange('linkedin_url', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;