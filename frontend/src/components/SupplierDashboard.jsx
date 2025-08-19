import React, { useMemo } from 'react';
import { useGetSupplierDashboardQuery } from '../features/api/supplier.api';
import { Card, CardHeader, CardContent } from './Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGavel, faCheckCircle, faTimesCircle, faHourglassHalf, faPercentage, faMoneyBillWave, faTrophy } from '@fortawesome/free-solid-svg-icons';

const COLORS = ['#4CAF50', '#F44336', '#FFC107']; // Accepted, Rejected, Pending colors

export default function SupplierDashboard() {
  const { data, isLoading, isError } = useGetSupplierDashboardQuery();
const stats = data?.data || {};

 // ② Always call useMemo for computed stats
 const recent = stats.recentBids || [];
 const { totalBidAmount, avgBidAmount } = React.useMemo(() => {
   const sum = recent.reduce((acc, b) => acc + b.bidAmount, 0);
   const avg = recent.length ? sum / recent.length : 0;
   return { totalBidAmount: sum, avgBidAmount: Math.round(avg) };
 }, [recent]);

  if (isLoading) return <p>Loading dashboard...</p>;
  if (isError) return <p className="text-red-500">Failed to load dashboard.</p>;

 const {
     totalBids,
     acceptedBids,
     rejectedBids,
     pendingBids,
     winRate,
     totalWonAmount,
     // we now use our memoized totalBidAmount & avgBidAmount
     // avgResponseTime,
     recentBids
   } = stats;


  // Prepare chart data
  const chartData = recentBids.map(bid => ({
    date: new Date(bid.createdAt).toLocaleDateString(),
    amount: bid.bidAmount,
  }));

  const pieData = [
    { name: 'Accepted', value: acceptedBids },
    { name: 'Rejected', value: rejectedBids },
    { name: 'Pending', value: pendingBids },
  ];

  const performanceBadges = [];
  if (winRate > 70) performanceBadges.push('🏆 Excellent Win Rate');
  if (totalBids > 50) performanceBadges.push('🔥 Active Supplier');

  return (
    <div className="space-y-10 p-6">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-primary-dark">Supplier Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4   gap-6">
        <SummaryCard title="Total Bids" value={totalBids} icon={faGavel} color="text-blue-600" />
        <SummaryCard title="Accepted" value={acceptedBids} icon={faCheckCircle} color="text-green-600" />
        <SummaryCard title="Rejected" value={rejectedBids} icon={faTimesCircle} color="text-red-600" />
        <SummaryCard title="Pending" value={pendingBids} icon={faHourglassHalf} color="text-yellow-500" />
        <SummaryCard title="Win Rate (%)" value={`${winRate}%`} icon={faPercentage} color="text-purple-600" />
        <SummaryCard title="Total Bid Amount" value={`₹${totalBidAmount}`} icon={faMoneyBillWave} color="text-indigo-600" />
        <SummaryCard title="Avg Bid Amount" value={`₹${avgBidAmount}`} icon={faMoneyBillWave} color="text-pink-600" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card className="p-4">
          <CardHeader>Recent Bids</CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#3182CE" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Line Chart */}
        <Card className="p-4">
          <CardHeader>Bid Trends</CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#38BDF8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pie Chart */}
      <div className="max-w-md mx-auto">
        <Card className="p-4">
          <CardHeader>Bid Outcome Distribution</CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Bid Activity</h2>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-primary text-white">
              <tr>
                <th className="py-2 px-4 text-left">Tender</th>
                <th className="py-2 px-4 text-left">Amount (₹)</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentBids.map(bid => (
                <tr key={bid._id} className="border-t">
                  <td className="py-2 px-4">{bid.tender?.title}</td>
                  <td className="py-2 px-4">{bid.bidAmount}</td>
                  <td className={`py-2 px-4 font-bold ${
                    bid.status === 'accepted' ? 'text-green-600' :
                    bid.status === 'rejected' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {bid.status}
                  </td>
                  <td className="py-2 px-4">{new Date(bid.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Badges */}
      {performanceBadges.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-8">
          {performanceBadges.map((badge, index) => (
            <span key={index} className="bg-green-100 text-green-800 font-semibold px-4 py-2 rounded-full">
              {badge}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Small Card Component
const SummaryCard = ({ title, value, icon, color }) => (
  <Card className="flex flex-col items-center justify-center p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
    <FontAwesomeIcon icon={icon} className={`text-4xl mb-2 ${color}`} />
    <CardHeader className="text-lg font-semibold">{title}</CardHeader>
    <CardContent className="text-2xl font-bold">{value}</CardContent>
  </Card>
);
