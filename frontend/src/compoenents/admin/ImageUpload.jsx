import { CloudUpload, Image, Trash2 } from 'lucide-react';
import React from 'react'

const ImageUpload = ({ images, onUpload, onRemove }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Image className="w-5 h-5 text-blue-600" />
        Book Covers
      </h3>

      <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-blue-600 transition-colors bg-gray-50 cursor-pointer group">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
          <CloudUpload className="w-7 h-7" />
        </div>
        <p className="text-sm font-bold text-gray-900">Click to upload or drag and drop</p>
        <p className="text-xs text-gray-500 mt-1">PNG, JPG or WEBP</p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={onUpload}
          className="hidden"
        />
      </label>

      {images.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3">
          {images.map((image, index) => (
            <div key={index} className="relative group aspect-[3/4] rounded-lg overflow-hidden border border-gray-300">
              <div
                className="bg-center bg-cover h-full w-full"
                style={{ backgroundImage: `url(${image.url})` }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => onRemove(index)}
                  className="bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 italic">
          Tip: Use high-resolution vertical images for the best catalog display.
        </p>
      </div>
    </div>
  );
};

export default ImageUpload