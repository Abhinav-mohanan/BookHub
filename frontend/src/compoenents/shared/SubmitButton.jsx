import React from 'react'

const SubmitButton = ({ children, onClick, loading = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-sm transition-colors mt-1 
      disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {loading ? 'Please wait...' : children}
    </button>
  );
};

export default SubmitButton