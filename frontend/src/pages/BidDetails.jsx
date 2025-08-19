// src/pages/BidDetails.jsx
import React, { use } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetBidDetailsQuery, useUpdateBidStatusMutation } from '../features/api/bid.api';
import { useSelector } from 'react-redux';
import { Card, CardHeader, CardContent, CardFooter } from '../components/Card';
import { Button } from '../components';
import { format } from 'date-fns';

export default function BidDetails() {
  const { bidId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  // 1) Fetch full bid details
  const {
    data: bidRes,
    isLoading,
    isError,
    refetch
  } = useGetBidDetailsQuery(bidId);
  const bid = bidRes?.data;

  // 2) Mutation for accept/reject
  const [updateStatus, { isLoading: updating }] = useUpdateBidStatusMutation();

  if (isLoading) return <p>Loading bid details…</p>;
  if (isError || !bid) return <p className="text-red-500">Bid not found.</p>;

  const { tender, supplier, bidAmount, status, proposal, proposalDoc, createdAt } = bid;
  // 3) Determine if current user can manage this bid

// “createdBy” is now a nested user object
// e.g. tender.createdBy._id, tender.createdBy.role
const isGovRole = ['admin','procurement_officer','department_head'].includes(user.role);
const isOwner   = tender.createdBy?._id === user._id;

const canManage = isGovRole && isOwner;
  // Handler
  const handleDecision = async (newStatus) => {
    try {
      await updateStatus({ bidId, status: newStatus }).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Bid Details</h1>

      {/* Overview Card */}
      <Card>
        <CardHeader>
          <h2 className="text-xl">{tender.title}</h2>
          <p className="text-sm text-gray-600">
            Tender by you • Deadline: {format(new Date(tender.deadline), 'dd MMM yyyy')}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Supplier</h3>
            <p>{supplier.name} ({supplier.email})</p>
          </div>

          <div>
            <h3 className="font-semibold">Bid Amount</h3>
            <p>₹{bidAmount.toLocaleString()}</p>
          </div>

          <div>
            <h3 className="font-semibold">Proposal</h3>
            <p>{proposal || '—'}</p>
          </div>

          {proposalDoc?.url && (
            <div>
              <h3 className="font-semibold">Proposal Document</h3>
              <a
                href={proposalDoc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {proposalDoc.filename || 'Download'}
              </a>
            </div>
          )}

          <div>
            <h3 className="font-semibold">Status</h3>
            <p className={`font-medium ${
              status === 'accepted'
                ? 'text-green-600'
                : status === 'rejected'
                ? 'text-red-600'
                : 'text-yellow-600'
            }`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Submitted On</h3>
            <p>{format(new Date(createdAt), 'dd MMM yyyy, hh:mm a')}</p>
          </div>
        </CardContent>

        {/* Action Buttons */}
        {canManage && status === 'pending' && (
          <CardFooter className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => handleDecision('rejected')}
              disabled={updating}
            >
              Reject
            </Button>
            <Button
              onClick={() => handleDecision('accepted')}
              disabled={updating}
            >
              Accept
            </Button>
          </CardFooter>
        )}
      </Card>

      <Button onClick={() => navigate(-1)} variant="ghost">
        Back
      </Button>
    </div>
  );
}
