import React from 'react'
import { X } from 'lucide-react';

const ConfirmationModal = ({ open, title, message, confirmText, onConfirm, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md mx-4 shadow-2xl">
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-serif text-gray-900">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-6">
          <p className="text-gray-700 text-sm leading-relaxed">{message}</p>
        </div>

        <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
          >
            {confirmText || 'Countinue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal