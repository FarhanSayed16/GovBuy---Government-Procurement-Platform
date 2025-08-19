// src/components/TendersFilter.jsx
import React from 'react';

export default function TendersFilter({ categories, selectedCategory, onCategoryChange, searchTerm, onSearchChange }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      {/* Search */}
      <input
        type="text"
        placeholder="Search tenders..."
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
        className="mb-4 md:mb-0 w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
      />

      {/* Category Filter */}
      <select
        value={selectedCategory}
        onChange={e => onCategoryChange(e.target.value)}
        className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
      >
        <option value="">All Categories</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}


