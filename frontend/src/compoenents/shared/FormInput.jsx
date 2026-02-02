import { Eye, EyeOff } from 'lucide-react';
import React from 'react'

const FormInput = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
  icon: Icon, 
  error,
  showPasswordToggle = false,
  showPassword = false,
  onTogglePassword,
  disabled = false
}) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-2">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        <input
          type={showPasswordToggle && showPassword ? 'text' : type}
          name={name}
          value={value}
          disabled={disabled}
          onChange={onChange}
          className={`w-full ${Icon ? 'pl-10' : 'px-4'} ${showPasswordToggle ? 'pr-12' : 'pr-4'} py-3 border border-gray-300 rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed`}
          placeholder={placeholder}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};
export default FormInput