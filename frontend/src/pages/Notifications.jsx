import React from 'react';
import { useGetNotificationsQuery, useMarkAsReadMutation, useMarkAllAsReadMutation } from '../features/api/notification.api';
import NotificationItem from '../components/NotificationItem';
import { Button } from '../components';

export default function Notifications() {
  const { data, isLoading, isError } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [markAll] = useMarkAllAsReadMutation();

  const notes = data?.data || [];

  if (isLoading) return <p>Loading notifications...</p>;
  if (isError) return <p className="text-red-500">Error loading notifications.</p>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <Button variant="outline" onClick={() => markAll()}>
          Mark All as Read
        </Button>
      </div>

      {notes.length === 0 ? (
        <p className="text-gray-600">You have no notifications.</p>
      ) : (
        notes.map(note => (
          <NotificationItem
            key={note._id}
            note={note}
            onMarkRead={(id) => markAsRead(id)}
          />
        ))
      )}
    </div>
  );
}
