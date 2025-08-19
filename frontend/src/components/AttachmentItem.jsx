import React from 'react';
import { useGetDocumentByIdQuery } from '../features/api/document.api';

export default function AttachmentItem({ docId }) {
  const { data: res, isLoading, isError } = useGetDocumentByIdQuery(docId, {
    skip: !docId
  });
  const doc = res?.data;

  if (isLoading) return <li className="text-gray-500">Loading…</li>;
  if (isError || !doc) return <li className="text-red-500">Error loading document</li>;

  return (
    <li>
      <a
        href={doc.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        {doc.filename}
      </a>
    </li>
  );
}
