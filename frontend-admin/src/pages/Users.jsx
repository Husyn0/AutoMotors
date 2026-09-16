// src/pages/Users.jsx
import React, { useEffect, useState } from 'react';
import {
  FaUserPlus,
  FaUserShield,
  FaUser,
  FaEnvelope,
  FaLock,
  FaCheckCircle,
  FaExclamationCircle,
} from 'react-icons/fa';
import usersApi from '../api/usersApi';
import { useAuth } from '../context/AuthContext';

const initialFormData = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
};

const Users = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null); // { type, text }
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (!message || message.type !== 'success') return;
    const t = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(t);
  }, [message]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const handleBlur = (key) =>
    setTouched((prev) => ({ ...prev, [key]: true }));

  // ── Derived validation state ────────────────────────────────
  const errors = {
    name:
      touched.name && formData.name.trim().length < 2
        ? 'Name must be at least 2 characters.'
        : null,
    email:
      touched.email && !/^\S+@\S+\.\S+$/.test(formData.email)
        ? 'Please enter a valid email address.'
        : null,
    password:
      touched.password && formData.password.length < 8
        ? 'Password must be at least 8 characters.'
        : null,
    password_confirmation:
      touched.password_confirmation &&
      formData.password_confirmation !== formData.password
        ? 'Passwords do not match.'
        : null,
  };

  const isValid =
    formData.name.trim().length >= 2 &&
    /^\S+@\S+\.\S+$/.test(formData.email) &&
    formData.password.length >= 8 &&
    formData.password === formData.password_confirmation;

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);

    try {
      await usersApi.register(formData);
      setMessage({
        type: 'success',
        text: `Admin "${formData.name}" was created successfully.`,
      });
      setFormData(initialFormData);
      setTouched({});
    } catch (err) {
      const data = err.response?.data;
      const firstFieldError =
        data?.errors && Object.values(data.errors)[0]?.[0];
      setMessage({
        type: 'danger',
        text: firstFieldError || data?.message || 'Failed to create admin.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const avatarInitial = (formData.name || '?').trim().charAt(0).toUpperCase();

  return (
    <div className="users-page">
      <div className="page-header">
        <h1>User Management</h1>
      </div>

      <div className="users-grid">
        {/* ── Current admin card ───────────────────────────── */}
        <div className="settings-card current-user-card">
          <h3>
            <FaUserShield /> Current Administrator
          </h3>
          {user ? (
            <>
              <div className="current-user-info">
                <div className="user-avatar">
                  {(user.name || '?').charAt(0).toUpperCase()}
                </div>
                <div className="user-meta">
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                  <small>ID #{user.id}</small>
                </div>
              </div>
              <div className="user-badge-row">
                <span className="user-badge badge-admin">Administrator</span>
                <span className="user-badge badge-active">
                  <FaCheckCircle /> Active
                </span>
              </div>
              <p className="hint">
                Only the currently authenticated administrator can be displayed.
                The backend does not expose a user list endpoint.
              </p>
            </>
          ) : (
            <p>Loading…</p>
          )}
        </div>

        {/* ── Register new admin form ──────────────────────── */}
        <div className="settings-card register-card">
          <div className="register-card__header">
            <div className="register-card__icon">
              <FaUserPlus />
            </div>
            <div>
              <h3>Register New Admin</h3>
              <p className="register-card__subtitle">
                Create a new administrator account with full access.
              </p>
            </div>
          </div>

          {message && (
            <div className={`alert alert-${message.type} alert--with-icon`}>
              {message.type === 'success' ? (
                <FaCheckCircle className="alert-icon" />
              ) : (
                <FaExclamationCircle className="alert-icon" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Avatar preview */}
            <div className="avatar-preview">
              <div className="avatar-preview__circle">{avatarInitial}</div>
              <div className="avatar-preview__text">
                <strong>{formData.name || 'New Administrator'}</strong>
                <span>{formData.email || 'admin@automotors.com'}</span>
              </div>
            </div>

            {/* Name */}
            <div className={`field ${errors.name ? 'field--error' : ''}`}>
              <label htmlFor="reg-name">
                <FaUser className="field-icon" /> Full Name
              </label>
              <input
                id="reg-name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                placeholder="Jane Doe"
              />
              {errors.name && (
                <span className="field-error">{errors.name}</span>
              )}
            </div>

            {/* Email */}
            <div className={`field ${errors.email ? 'field--error' : ''}`}>
              <label htmlFor="reg-email">
                <FaEnvelope className="field-icon" /> Email Address
              </label>
              <input
                id="reg-email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="jane@automotors.com"
              />
              {errors.email && (
                <span className="field-error">{errors.email}</span>
              )}
            </div>

            {/* Password row */}
            <div className="field-row">
              <div className={`field ${errors.password ? 'field--error' : ''}`}>
                <label htmlFor="reg-password">
                  <FaLock className="field-icon" /> Password
                </label>
                <input
                  id="reg-password"
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <span className="field-error">{errors.password}</span>
                )}
              </div>

              <div
                className={`field ${
                  errors.password_confirmation ? 'field--error' : ''
                }`}
              >
                <label htmlFor="reg-password-confirm">
                  <FaLock className="field-icon" /> Confirm Password
                </label>
                <input
                  id="reg-password-confirm"
                  type="password"
                  autoComplete="new-password"
                  value={formData.password_confirmation}
                  onChange={(e) =>
                    handleChange('password_confirmation', e.target.value)
                  }
                  onBlur={() => handleBlur('password_confirmation')}
                  placeholder="••••••••"
                />
                {errors.password_confirmation && (
                  <span className="field-error">
                    {errors.password_confirmation}
                  </span>
                )}
              </div>
            </div>

            {/* Password strength meter */}
            {formData.password && (
              <div className="password-strength">
                <div className="password-strength__bar">
                  <div
                    className={`password-strength__fill strength-${passwordStrength.level}`}
                    style={{ width: `${passwordStrength.percent}%` }}
                  />
                </div>
                <span className="password-strength__label">
                  {passwordStrength.label}
                </span>
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setFormData(initialFormData);
                  setTouched({});
                  setMessage(null);
                }}
                disabled={submitting}
              >
                Reset
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={submitting || !isValid}
              >
                <FaUserPlus />
                {submitting ? 'Creating…' : 'Create Admin'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ── Small helper: password strength ─────────────────────────── */
function getPasswordStrength(pwd) {
  if (!pwd) return { level: 0, percent: 0, label: '' };

  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  const map = {
    0: { level: 0, percent: 10, label: 'Very weak' },
    1: { level: 1, percent: 25, label: 'Weak' },
    2: { level: 2, percent: 50, label: 'Fair' },
    3: { level: 3, percent: 70, label: 'Good' },
    4: { level: 4, percent: 88, label: 'Strong' },
    5: { level: 5, percent: 100, label: 'Very strong' },
  };
  return map[score] || map[0];
}

export default Users;