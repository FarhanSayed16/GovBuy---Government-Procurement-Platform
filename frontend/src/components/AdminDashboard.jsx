import React from 'react';
import { useGetAdminStatsQuery } from '../features/api/dashboard.api';
import { Card, CardHeader, CardContent } from './Card';

export default function AdminDashboard() {
  const { data, isLoading, isError } = useGetAdminStatsQuery();
  const stats = data?.data;
  if (isLoading) return <p>Loading dashboard...</p>;
  if (isError) return <p className="text-red-500">Failed to load dashboard stats.</p>;

  const {
    totalSuppliers,
    pendingSuppliers,
    totalTenders,
    openTenders,
    closedTenders,
    totalBids,
    avgBidsPerTender,
    recentTenders,
    recentBids
  } = stats;



  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card><CardHeader>Total Suppliers</CardHeader><CardContent>{totalSuppliers}</CardContent></Card>
        <Card><CardHeader>Pending Suppliers</CardHeader><CardContent>{pendingSuppliers}</CardContent></Card>
        <Card><CardHeader>Total Tenders</CardHeader><CardContent>{totalTenders}</CardContent></Card>
        <Card><CardHeader>Open Tenders</CardHeader><CardContent>{openTenders}</CardContent></Card>
        <Card><CardHeader>Closed Tenders</CardHeader><CardContent>{closedTenders}</CardContent></Card>
        <Card><CardHeader>Total Bids</CardHeader><CardContent>{totalBids}</CardContent></Card>
        <Card><CardHeader>Avg. Bids/Tender</CardHeader><CardContent>{avgBidsPerTender.toFixed(2)}</CardContent></Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>Recent Tenders</CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {recentTenders.map(t => (
                <li key={t._id}>{t.title} - {new Date(t.createdAt).toLocaleDateString()}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>Recent Bids</CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {recentBids.map(b => (
                <li key={b._id}>{b.supplier.name} on {b.tender.title} - ₹{b.bidAmount}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
