// src/components/common/ImageUploadField.jsx
import React, { useRef, useState } from 'react';
import { FaUpload, FaTrash, FaSpinner, FaImage } from 'react-icons/fa';
import uploadsApi from '../../api/uploadsApi';

/**
 * Props
 *  - name:        form field name (e.g. "image")
 *  - value:       current storage path (or legacy URL)
 *  - onChange:    (name, path) => void
 *  - folder:      upload folder ('products' | 'categories' | 'projects' | ...)
 *  - fullWidth:   boolean
 *  - accept:      input accept attr (default 'image/*')
 */
const ImageUploadField = ({
  name,
  value,
  onChange,
  folder,
  fullWidth = false,
  accept = 'image/*',
}) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const previewUrl = uploadsApi.resolveUrl(value);

  const handlePick = () => inputRef.current?.click();

  const handleFile = async (file) => {
    if (!file) return;
    setError('');
    setUploading(true);
    setProgress(0);
    try {
      const res = await uploadsApi.upload(folder, file, setProgress);
      // res.path is what we store in the DB
      onChange(name, res.path);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 422
          ? 'Invalid file (type or size).'
          : 'Upload failed. Please try again.');
      setError(msg);
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleInputChange = (e) => handleFile(e.target.files?.[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleClear = () => {
    setError('');
    onChange(name, '');
  };

  return (
    <div
      className={`image-upload ${fullWidth ? 'full-width' : ''} ${
        error ? 'image-upload--error' : ''
      }`}
    >
      <div
        className="image-upload__dropzone"
        onClick={handlePick}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handlePick()}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="preview"
            className="image-upload__preview"
            onError={(e) => {
              // Broken URL → show placeholder
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="image-upload__placeholder">
            <FaImage />
            <span>Click or drop an image</span>
          </div>
        )}

        {uploading && (
          <div className="image-upload__overlay">
            <FaSpinner className="image-upload__spinner" />
            <span>{progress}%</span>
          </div>
        )}
      </div>

      <div className="image-upload__actions">
        <button
          type="button"
          className="btn-secondary image-upload__btn"
          onClick={handlePick}
          disabled={uploading}
        >
          <FaUpload /> {value ? 'Replace' : 'Upload'}
        </button>

        {value && (
          <button
            type="button"
            className="btn-secondary image-upload__btn image-upload__btn--danger"
            onClick={handleClear}
            disabled={uploading}
          >
            <FaTrash /> Remove
          </button>
        )}
      </div>

      {value && (
        <input
          type="text"
          className="image-upload__path"
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          spellCheck={false}
          aria-label="Image path"
        />
      )}

      {error && <span className="image-upload__error">{error}</span>}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ImageUploadField;