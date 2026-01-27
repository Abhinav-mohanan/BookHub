import React from 'react'

const FormTextarea = ({ label, name, value, onChange, placeholder, rows = 6 }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-gray-900 text-base font-semibold">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="form-textarea w-full rounded-lg text-gray-900 border border-gray-300 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 p-4 text-base resize-none"
      />
    </div>
  );
};
export default FormTextarea