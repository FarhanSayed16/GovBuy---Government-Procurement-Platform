// src/components/BidCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter } from './Card';
import { Button } from './index';
import { format } from 'date-fns';
import { useGetDocumentByIdQuery } from '../features/api/document.api';
import { useGetSupplierByIdQuery } from '../features/api/supplier.api';

export default function BidCard({ bid, viewBid = false }) {
  const {
    proposalDoc,
    supplier: supplierOrId,
    bidAmount,
    status,
    createdAt,
    tender,
    _id: bidId
  } = bid;

  // 1) Proposal doc fetch
  const { data: docRes } = useGetDocumentByIdQuery(proposalDoc, { skip: !proposalDoc });
  const doc = docRes?.data;

  // 2) Supplier fetch if needed
  const isId = typeof supplierOrId === 'string';
  const { data: supplierRes } = useGetSupplierByIdQuery(
    isId ? supplierOrId : undefined,
    { skip: !isId }
  );
  const supplier = isId ? supplierRes?.data : supplierOrId;

  return (
    <Card className="p-4">
      {/* Header */}
      <CardHeader className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">
            {viewBid ? `Bid on: ${tender.title}` : tender.title}
          </h3>
          <p className="text-sm text-gray-600">
            By: {supplier?.name} ({supplier?.email})
          </p>
        </div>
        <span className="text-sm text-gray-500">
          {format(new Date(createdAt), 'dd MMM yyyy')}
        </span>
      </CardHeader>

      {/* Content */}
      <CardContent>
        <p className="text-gray-700 mb-2">
          Amount: ₹{bidAmount.toLocaleString()}
        </p>
        <p className="text-gray-700 mb-2">Status: {status}</p>
        {doc && (
          <p className="mt-2">
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {doc.filename || 'View Proposal Document'}
            </a>
          </p>
        )}
      </CardContent>

      {/* Footer */}
      <CardFooter>
        {viewBid ? (
          <Link to={`/bids/${bidId}`}>
            <Button>View Bid Detail</Button>
          </Link>
        ) : (
          <Link to={`/tenders/${tender._id}`}>
            <Button>View Tender</Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
