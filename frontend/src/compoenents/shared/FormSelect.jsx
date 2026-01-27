import React from 'react'

const FormSelect = ({ label, name, value, onChange, options }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-900">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelect