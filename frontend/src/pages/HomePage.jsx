import React from 'react';
import { useGetTendersQuery } from '../features/api/tender.api';
import TenderCard from '../components/TenderCard';
import { HeroBanner } from '../components';
import CategoryScroller from '../components/CategoryScroller';
import InfoSection from '../components/InfoSection';
import TestimonialCards from '../components/TestimonialCarousel';

export default function Home() {
  const { data, isLoading, isError } = useGetTendersQuery();
  const tenders = data?.data || [];
  console.log("Tenders",tenders)
  return (
    <div>
      {/* Hero Section */}
      <HeroBanner />
      <CategoryScroller />
      <InfoSection />

      {/* Featured Tenders */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Latest Tenders</h2>

        {isLoading && <p>Loading tenders...</p>}
        {isError  && <p className="text-red-500">Failed to load tenders.</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenders?.docs?.slice(0, 6).map(tender => (
            <TenderCard key={tender._id} tender={tender} />
          ))}
        </div>

        {tenders?.docs?.length > 6 && (
          <div className="mt-8 text-center">
            <a href="/tenders" className="text-blue-600 hover:underline">
              View All Tenders →
            </a>
          </div>
        )}
      </section>

      <TestimonialCards />

    </div>
  );
}