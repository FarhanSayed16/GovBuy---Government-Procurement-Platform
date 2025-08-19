import React from 'react';
import AttachmentItem from './AttachmentItem';

export default function AttachmentsList({ ids }) {
  if (!ids || ids.length === 0) return null;

  return (
    <ul className="list-disc list-inside text-blue-600">
      {ids.map(docId => (
        <AttachmentItem key={docId} docId={docId} />
      ))}
    </ul>
  );
}
