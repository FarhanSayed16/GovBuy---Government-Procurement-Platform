import React from 'react';
import { useSelector } from 'react-redux';
import SupplierDashboard from '../components/SupplierDashboard';
import AdminDashboard from '../components/AdminDashboard';
import {useGetCurrentUserQuery} from "../features/api/user.api"

export default function DashboardPage() {
  const { data, isLoading, error } = useGetCurrentUserQuery(undefined, {
    refetchOnMountOrArgChange: true
  });
  
  if (isLoading) return <Loader fullScreen />;
  if (error || !data?.data) return <p className="text-red-500">Failed to load user.</p>;

  // 2) Grab the freshly fetched user
  const user = data.data;
  console.log("user",user)
  if (user.role === 'admin') {
    return <AdminDashboard />;
  }

  if (user.role === 'supplier') {
    return <SupplierDashboard />;
  }

  return <p className="text-gray-600">Dashboard is not available for your role.</p>;
}
