// src/components/NotificationItem.jsx
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from './index';

/**
 * NotificationItem displays a single notification message,
 * its relative timestamp, and a button to mark it as read.
 *
 * Props:
 * - note: { _id, message, createdAt, isRead }
 * - onMarkRead: (id: string) => void
 */
export default function NotificationItem({ note, onMarkRead }) {
  return (
    <div
      className={`p-4 mb-3 flex justify-between items-start rounded-md transition-colors duration-200
        ${note.isRead ? 'bg-gray-100' : 'bg-white shadow'}`}
    >
      <div>
        <p className={`text-gray-800 ${note.isRead ? '' : 'font-semibold'}`}>{note.message}</p>
        <p className="text-xs text-gray-500 mt-1">
          {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
        </p>
      </div>
      {!note.isRead && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onMarkRead(note._id)}
        >
          Mark Read
        </Button>
      )}
    </div>
  );
}
