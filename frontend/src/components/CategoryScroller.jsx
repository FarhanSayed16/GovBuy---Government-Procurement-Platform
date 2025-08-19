// src/components/CategoryScroller.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Agriculture',       image: '/images/agriculture2.jpeg' },
  { name: 'Construction',      image: '/images/construction.jpeg' },
  { name: 'Education',         image: '/images/education.png' },
  { name: 'IT Infrastructure', image: '/images/IT.png' },
  { name: 'Healthcare',        image: '/images/healthcare2.png' },
];

export default function CategoryScroller() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">
          Explore Procurement Categories
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {categories.map(({ name, image }) => (
            <Link
              key={name}
              to={`/tenders?category=${encodeURIComponent(
                name.toLowerCase()
              )}`}
            >
              <div className="group relative rounded-xl shadow hover:shadow-lg transition duration-300 cursor-pointer overflow-hidden">
                <img
                  src={image}
                  alt={name}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-25 group-hover:bg-opacity-50 transition duration-300 flex items-end p-4">
                  <h3 className="text-white text-lg font-semibold">{name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
