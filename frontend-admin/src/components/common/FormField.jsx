// src/components/common/FormField.jsx
import React from 'react';

/**
 * @param {Object} props
 * @param {string} props.type - 'text' | 'number' | 'textarea' | 'select' | 'url' | 'email'
 * @param {string} props.name
 * @param {string} props.placeholder
 * @param {*} props.value
 * @param {(name: string, value: any) => void} props.onChange
 * @param {boolean} [props.required]
 * @param {boolean} [props.fullWidth]
 * @param {Array<{value: string, label: string, emoji?: string}>} [props.options] - for select
 * @param {string} [props.selectPlaceholder] - for select
 * @param {boolean} [props.emoji] - render options as emoji + label
 */
const FormField = ({
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  required = false,
  fullWidth = false,
  options = [],
  selectPlaceholder = 'Select...',
  emoji = false,
}) => {
  const commonProps = {
    name,
    value: value ?? '',
    required,
    placeholder,
    onChange: (e) => onChange(name, e.target.value),
    className: fullWidth ? 'full-width' : '',
  };

  if (type === 'textarea') {
    return <textarea {...commonProps} />;
  }

  if (type === 'select') {
    return (
      <select {...commonProps} className={`${commonProps.className} ${emoji ? 'emoji-select' : ''}`.trim()}>
        <option value="">{selectPlaceholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.emoji ? `${opt.emoji}  ${opt.label}` : opt.label}
          </option>
        ))}
      </select>
    );
  }

  return <input type={type} {...commonProps} />;
};

export default FormField;