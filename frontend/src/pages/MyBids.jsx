import React from 'react';
import { useGetMyBidsQuery } from '../features/api/bid.api';
import BidCard from '../components/BidCard';

export default function MyBids() {
  const { data, isLoading, isError } = useGetMyBidsQuery();
  const bids = data?.data || [];
  console.log("bids",bids)
  if (isLoading) return <p>Loading your bids...</p>;
  if (isError) return <p className="text-red-500">Error fetching your bids.</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Bids</h1>
      {bids.length === 0 ? (
        <p className="text-gray-600">You have not submitted any bids yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bids.docs?.map(bid => (
            <BidCard key={bid._id} bid={bid} />
          ))}
        </div>
      )}
    </div>
  );
}
