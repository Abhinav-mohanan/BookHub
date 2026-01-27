import React from 'react';

const SelectDropdown = ({
  label,
  options = [],
  name,
  value,
  onChange,
  placeholder = 'Select an option',
  hint,
  error,
  disabled = false,
}) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          {label}
        </label>
      )}

      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full rounded-lg border px-3 py-2.5 text-sm font-medium 
          focus:outline-none focus:ring-2 transition-all uppercase
          ${
            error
              ? 'border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:ring-blue-200'
          }
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        `}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {hint && (
        <p className="text-xs text-gray-500 mt-2">{hint}</p>
      )}

      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default SelectDropdown;
