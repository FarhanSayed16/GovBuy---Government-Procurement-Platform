// src/pages/MyTenders.jsx
import React from 'react';
import { useGetMyTendersQuery } from '../features/api/tender.api';
import TenderCard from '../components/TenderCard';

export default function MyTenders() {
  // Fetch tenders created by the logged-in government user
  const { data, isLoading, isError } = useGetMyTendersQuery();
  const myTenders = data?.data || [];

  if (isLoading) return <p>Loading your tenders...</p>;
  if (isError) return <p className="text-red-500">Error fetching your tenders.</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Posted Tenders</h1>
      {myTenders.length === 0 ? (
        <p className="text-gray-600">You have not posted any tenders yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myTenders.map(tender => (
            <TenderCard key={tender._id} tender={tender} />
          ))}
        </div>
      )}
    </div>
  );
}
