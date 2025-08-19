// src/pages/AdminUsers.jsx
import React, { useState } from 'react';
import { useGetAllUsersQuery, useUpdateUserRoleAndStatusMutation } from '../features/api/user.api';
import { Card, CardHeader, CardContent, CardFooter } from '../components/Card';
import { Button } from '../components';
import { toast } from 'react-toastify';

const allRoles = [
  'admin',
  'supplier',
  'government',
  'procurement_officer',
  'department_head',
  'finance_officer',
  'legal_advisor',
];
const statusOptions = ['pending', 'approved', 'rejected'];

export default function AdminUsers() {
  // Fetch users
  const { data, isLoading, isError } = useGetAllUsersQuery();
  const users = data?.data || [];

  // Filters
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Mutation hook
  const [updateUser, { isLoading: updating }] = useUpdateUserRoleAndStatusMutation();

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUser({ userId, role: newRole }).unwrap();
      toast.success('Role updated');
    } catch (err) {
      toast.error(err.data?.message || 'Update failed');
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await updateUser({ userId, status: newStatus }).unwrap();
      toast.success(`User ${newStatus}`);
    } catch (err) {
      toast.error(err.data?.message || 'Status update failed');
    }
  };

  if (isLoading) return <p>Loading users...</p>;
  if (isError)   return <p className="text-red-500">Error loading users.</p>;

  // Apply filters
  const filtered = users.filter(u => {
    const byRole   = roleFilter   ? u.role === roleFilter   : true;
    const byStatus = statusFilter ? u.status === statusFilter : true;
    return byRole && byStatus;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold">Manage Users</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select
          className="px-3 py-2 border rounded-md"
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          {allRoles.map(r => (
            <option key={r} value={r}>
              {r.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}
            </option>
          ))}
        </select>

        <select
          className="px-3 py-2 border rounded-md"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          {statusOptions.map(s => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-600">No users match your criteria.</p>
      ) : (
        filtered.map(user => (
          <Card key={user._id} className="p-4">
            <CardHeader className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <div className="flex space-x-2">
                {user.status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(user._id, 'approved')}
                      disabled={updating}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(user._id, 'rejected')}
                      disabled={updating}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {user.status === 'approved' && (
                  <span className="text-green-600 font-medium">Approved</span>
                )}
                {user.status === 'rejected' && (
                  <span className="text-red-600 font-medium">Rejected</span>
                )}
              </div>
            </CardHeader>

            <CardContent className="flex items-center space-x-4 mt-4">
              <label className="font-medium">Role:</label>
              <select
                className="px-3 py-1 border border-gray-300 rounded-md"
                value={user.role}
                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                disabled={updating}
              >
                <option value="supplier">Supplier</option>
                <option value="government">Government</option>
                {allRoles
                  .filter(r => r !== 'supplier' && r !== 'government')
                  .map(r => (
                    <option key={r} value={r}>
                      {r.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}
                    </option>
                  ))
                }
              </select>
            </CardContent>

            <CardFooter className="text-sm text-gray-500">
              Joined: {new Date(user.createdAt).toLocaleDateString()}
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}
