import { Filter, Search } from 'lucide-react';
import React from 'react';

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Blocked', value: 'block' },
];

const FilterBar = ({ searchValue, onSearchChange, activeFilter, onFilterChange }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-6 p-4">
      <div className="flex flex-col md:flex-row gap-4 items-center">

        <div className="flex-1 w-full relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search users by name, email..."
            className="w-full h-11 pl-12 pr-4 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
          {FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => onFilterChange(value)}
              className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${
                activeFilter === value
                  ? 'bg-white text-blue-600 font-bold shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

export default FilterBar;
