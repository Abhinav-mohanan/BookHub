import React from 'react'

const RadioGroup = ({ label, options, name, value, onChange, hint, error }) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-2">
        {label}
      </label>
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
        {options.map((option) => (
          <label key={option.value} className="flex-1 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              className="hidden peer"
            />
            <div className="text-center py-2.5 rounded-md text-sm font-medium transition-all peer-checked:bg-white peer-checked:text-blue-600 peer-checked:shadow-sm text-gray-600">
              {option.label}
            </div>
          </label>
        ))}
      </div>
      {hint && (
        <p className="text-xs text-gray-500 mt-2">{hint}</p>
      )}
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default RadioGroup