import React, { useState, useMemo } from 'react';
import { useGetTendersQuery } from '../features/api/tender.api';
import TenderCard from '../components/TenderCard';
import TendersFilter from '../components/TendersFilter';
import { useSearchParams } from 'react-router-dom';

const categories = [
  'construction',
  'it infrastructure',
  'agriculture',
  'healthcare',
  'education'
];

export default function TendersList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // Whenever the user changes the dropdown:
  const onCategoryChange = (newCat) => {
    setSelectedCategory(newCat);
    newCat 
      ? setSearchParams({ category: newCat })
      : setSearchParams({});
  };

  const { data, isLoading, isError } = useGetTendersQuery();
  const tendersData = data?.data?.docs || [];

  const [searchTerm, setSearchTerm] = useState('');

  // Filtered list
  const filtered = useMemo(() => {
    return tendersData.filter(t => {
     const term = searchTerm.toLowerCase();
     const matchesSearch =
       t.title.toLowerCase().includes(term) ||
       t.city.toLowerCase().includes(term);
      const matchesCategory = selectedCategory
        ? t.category === selectedCategory
        : true;
      return matchesSearch && matchesCategory;
    });
  }, [tendersData, searchTerm, selectedCategory]);

  if (isLoading) return <p>Loading tenders...</p>;
  if (isError)   return <p className="text-red-500">Error loading tenders.</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">All Tenders</h1>

      <TendersFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {filtered.length === 0 ? (
        <p className="text-gray-600">No tenders match your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(tender => (
            <TenderCard key={tender._id} tender={tender} />
          ))}
        </div>
      )}
    </div>
  );
}
